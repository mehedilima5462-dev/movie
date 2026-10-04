import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Advertisement, AdPlacement, AdEvent, DeviceTarget } from '../types';
import { SEED_ADS } from '../data/seedAds';
import { isFirebaseConfigured, db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  writeBatch
} from 'firebase/firestore';

interface AdsContextType {
  ads: Advertisement[];
  loading: boolean;
  getAdForPlacement: (placement: AdPlacement) => Advertisement | null;
  trackImpression: (ad: Advertisement) => Promise<void>;
  trackClick: (ad: Advertisement) => Promise<void>;
  createAd: (adData: Omit<Advertisement, 'id' | 'createdAt' | 'impressions' | 'clicks'>) => Promise<Advertisement>;
  updateAd: (id: string, updates: Partial<Advertisement>) => Promise<Advertisement | null>;
  deleteAd: (id: string) => Promise<boolean>;
  toggleAdStatus: (id: string) => Promise<boolean>;
  resetAdsToDefault: () => Promise<void>;
  refreshAds: () => Promise<void>;
}

const LOCAL_ADS_KEY = 'moviehub_ads_data';
const LOCAL_AD_EVENTS_KEY = 'moviehub_ad_events_data';

const AdsContext = createContext<AdsContextType | undefined>(undefined);

// Helper for local storage
function getStoredAds(): Advertisement[] {
  try {
    const raw = localStorage.getItem(LOCAL_ADS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local ads', e);
  }
  localStorage.setItem(LOCAL_ADS_KEY, JSON.stringify(SEED_ADS));
  return SEED_ADS;
}

function saveStoredAds(ads: Advertisement[]) {
  try {
    localStorage.setItem(LOCAL_ADS_KEY, JSON.stringify(ads));
  } catch (e) {
    console.error('Error saving local ads', e);
  }
}

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ads from Firestore or local storage
  const loadAds = useCallback(async () => {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'ads'));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Advertisement));
          setAds(list);
          saveStoredAds(list);
          setLoading(false);
          return;
        } else {
          // Seed firestore
          const batch = writeBatch(db);
          for (const a of SEED_ADS) {
            batch.set(doc(db, 'ads', a.id), a);
          }
          await batch.commit();
          setAds(SEED_ADS);
          saveStoredAds(SEED_ADS);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Firestore ads fetch error, using local fallback', err);
      }
    }

    setAds(getStoredAds());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  // Determine current client device
  const getClientDevice = (): 'desktop' | 'mobile' => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'mobile' : 'desktop';
    }
    return 'desktop';
  };

  // Helper to pick active eligible ad for placement
  const getAdForPlacement = useCallback((placement: AdPlacement): Advertisement | null => {
    const currentDevice = getClientDevice();
    const today = new Date().toISOString().split('T')[0];

    const eligible = ads.filter((ad) => {
      if (!ad.active || ad.placement !== placement) return false;

      // Device targeting check
      if (ad.device !== 'all' && ad.device !== currentDevice) return false;

      // Date window check
      if (ad.startDate && ad.startDate > today) return false;
      if (ad.endDate && ad.endDate < today) return false;

      // Impression ceiling check
      if (ad.maxImpressions && ad.impressions >= ad.maxImpressions) return false;

      return true;
    });

    if (eligible.length === 0) return null;

    // Return the first eligible ad (or rotate)
    return eligible[0];
  }, [ads]);

  // Track impression
  const trackImpression = async (ad: Advertisement) => {
    // Increment in Firestore
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'ads', ad.id), {
          impressions: increment(1)
        });
        const eventRef = doc(collection(db, 'adEvents'));
        await setDoc(eventRef, {
          adId: ad.id,
          type: 'impression',
          placement: ad.placement,
          device: getClientDevice(),
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        // Silently fallback to local
      }
    }

    // Local increment
    setAds((prev) => {
      const updated = prev.map((item) =>
        item.id === ad.id ? { ...item, impressions: (item.impressions || 0) + 1 } : item
      );
      saveStoredAds(updated);
      return updated;
    });
  };

  // Track click
  const trackClick = async (ad: Advertisement) => {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'ads', ad.id), {
          clicks: increment(1)
        });
        const eventRef = doc(collection(db, 'adEvents'));
        await setDoc(eventRef, {
          adId: ad.id,
          type: 'click',
          placement: ad.placement,
          device: getClientDevice(),
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        // Silently fallback to local
      }
    }

    setAds((prev) => {
      const updated = prev.map((item) =>
        item.id === ad.id ? { ...item, clicks: (item.clicks || 0) + 1 } : item
      );
      saveStoredAds(updated);
      return updated;
    });
  };

  // Admin Create Ad
  const createAd = async (
    adData: Omit<Advertisement, 'id' | 'createdAt' | 'impressions' | 'clicks'>
  ): Promise<Advertisement> => {
    const id = `ad-${Date.now()}`;
    const newAd: Advertisement = {
      ...adData,
      id,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'ads', id), newAd);
      } catch (e) {
        console.error('Failed to create ad in Firestore', e);
      }
    }

    const updated = [newAd, ...ads];
    setAds(updated);
    saveStoredAds(updated);
    return newAd;
  };

  // Admin Update Ad
  const updateAd = async (id: string, updates: Partial<Advertisement>): Promise<Advertisement | null> => {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'ads', id), payload);
      } catch (e) {
        console.error('Failed to update ad in Firestore', e);
      }
    }

    let updatedAd: Advertisement | null = null;
    const updatedList = ads.map((a) => {
      if (a.id === id) {
        updatedAd = { ...a, ...payload };
        return updatedAd;
      }
      return a;
    });

    setAds(updatedList);
    saveStoredAds(updatedList);
    return updatedAd;
  };

  // Admin Delete Ad
  const deleteAd = async (id: string): Promise<boolean> => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'ads', id));
      } catch (e) {
        console.error('Failed to delete ad in Firestore', e);
      }
    }

    const filtered = ads.filter((a) => a.id !== id);
    setAds(filtered);
    saveStoredAds(filtered);
    return true;
  };

  // Admin Toggle Active Status
  const toggleAdStatus = async (id: string): Promise<boolean> => {
    const target = ads.find((a) => a.id === id);
    if (!target) return false;
    const newActive = !target.active;
    await updateAd(id, { active: newActive });
    return newActive;
  };

  // Reset to default sample ads
  const resetAdsToDefault = async () => {
    if (isFirebaseConfigured && db) {
      try {
        const batch = writeBatch(db);
        for (const a of SEED_ADS) {
          batch.set(doc(db, 'ads', a.id), a);
        }
        await batch.commit();
      } catch (e) {
        console.error('Failed to reset ads in Firestore', e);
      }
    }

    setAds(SEED_ADS);
    saveStoredAds(SEED_ADS);
  };

  return (
    <AdsContext.Provider
      value={{
        ads,
        loading,
        getAdForPlacement,
        trackImpression,
        trackClick,
        createAd,
        updateAd,
        deleteAd,
        toggleAdStatus,
        resetAdsToDefault,
        refreshAds: loadAds
      }}
    >
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
};
