import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { syncUserProfile } from '../firebase/services';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggleAdminDemoRole: () => void;
  isFirebaseActive: boolean;
}

const LOCAL_USER_KEY = 'moviehub_active_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check initial demo user if Firebase is not active
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      try {
        const stored = localStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error restoring demo user', e);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let role: 'user' | 'admin' = fbUser.email === 'admin@moviehubbd.com' || fbUser.email === 'mehedilima5462@gmail.com' ? 'admin' : 'user';

        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
              role = 'admin';
            }
          } catch (e) {
            console.warn('Could not read user role from Firestore', e);
          }
        }

        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          role,
          photoURL: fbUser.photoURL || '',
          createdAt: new Date().toISOString()
        };

        setUser(profile);
        syncUserProfile(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Offline/Demo auth simulation
      const isAdminEmail = email.toLowerCase().includes('admin') || email === 'mehedilima5462@gmail.com';
      const demoProfile: UserProfile = {
        uid: `demo-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        role: isAdminEmail ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      setUser(demoProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        const profile: UserProfile = {
          uid: cred.user.uid,
          email,
          displayName: name,
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };
        setUser(profile);
        await syncUserProfile(profile);
      }
    } else {
      const demoProfile: UserProfile = {
        uid: `demo-${Date.now()}`,
        email,
        displayName: name,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      setUser(demoProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else {
      const demoProfile: UserProfile = {
        uid: `demo-google-${Date.now()}`,
        email: 'user@google.com',
        displayName: 'Google Explorer',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUser(demoProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
    }
  };

  const toggleAdminDemoRole = () => {
    if (!user) {
      const adminProfile: UserProfile = {
        uid: 'demo-admin-id',
        email: 'admin@moviehubbd.com',
        displayName: 'Admin Manager',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setUser(adminProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(adminProfile));
    } else {
      const updated: UserProfile = {
        ...user,
        role: user.role === 'admin' ? 'user' : 'admin'
      };
      setUser(updated);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        toggleAdminDemoRole,
        isFirebaseActive: isFirebaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
