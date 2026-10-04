import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { useAds } from '../../context/AdsContext';
import { Advertisement } from '../../types';

interface InterstitialAdProps {
  isOpen: boolean;
  movieTitle: string;
  quality: string;
  onContinue: () => void;
  onClose: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({
  isOpen,
  movieTitle,
  quality,
  onContinue,
  onClose
}) => {
  const { getAdForPlacement, trackImpression, trackClick } = useAds();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const impressionLogged = useRef(false);

  useEffect(() => {
    if (isOpen) {
      const activeAd = getAdForPlacement('watch_interstitial');
      setAd(activeAd);
      setCountdown(5);
      setCanSkip(false);
      impressionLogged.current = false;

      // If no ad exists, bypass interstitial immediately!
      if (!activeAd) {
        onContinue();
      }
    }
  }, [isOpen, getAdForPlacement, onContinue]);

  useEffect(() => {
    if (isOpen && ad && !impressionLogged.current) {
      impressionLogged.current = true;
      trackImpression(ad);
    }
  }, [isOpen, ad, trackImpression]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || !ad) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSkip(true);
    }
  }, [isOpen, ad, countdown]);

  if (!isOpen || !ad) return null;

  const handleAdClick = () => {
    trackClick(ad);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative z-10 w-full max-w-xl bg-[#141414] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900/90 border-b border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
              {quality}
            </span>
            <span className="font-semibold text-white truncate max-w-xs">{movieTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Partner Preview</span>
          </div>
        </div>

        {/* Sponsor Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-800/80 pb-2">
            <span>Sponsor Presentation · {ad.sponsorName || 'Featured Partner'}</span>
            <span className="font-mono text-amber-400">
              {countdown > 0 ? `Stream begins in ${countdown}s` : 'Stream ready!'}
            </span>
          </div>

          <div className="space-y-3">
            {ad.imageUrl && (
              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleAdClick}
                className="block aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 group relative"
              >
                <img
                  src={ad.imageUrl}
                  alt={ad.headline || ad.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                      {ad.headline || ad.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white bg-red-600 px-2.5 py-1 rounded-md font-medium shadow-md">
                      {ad.callToAction || 'Visit Sponsor'}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            )}

            <div className="text-center sm:text-left">
              <h3 className="text-base font-bold text-white">
                {ad.headline || ad.name}
              </h3>
              {ad.description && (
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {ad.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {ad.targetUrl && (
              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleAdClick}
                className="text-xs text-neutral-300 hover:text-white underline underline-offset-4 hidden sm:inline"
              >
                Open Sponsor in New Tab &rarr;
              </a>
            )}

            <button
              onClick={onContinue}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
                canSkip
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-950/40'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {canSkip ? 'Continue to Authorized Stream' : `Continue in ${countdown}s`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
