import React, { useEffect, useRef } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { AdPlacement } from '../../types';
import { useAds } from '../../context/AdsContext';

interface NativeAdProps {
  placement: AdPlacement;
  className?: string;
}

export const NativeAd: React.FC<NativeAdProps> = ({ placement, className = '' }) => {
  const { getAdForPlacement, trackImpression, trackClick } = useAds();
  const ad = getAdForPlacement(placement);
  const impressionRecorded = useRef(false);

  useEffect(() => {
    if (ad && !impressionRecorded.current) {
      impressionRecorded.current = true;
      trackImpression(ad);
    }
  }, [ad, trackImpression]);

  // If no ad exists, render nothing
  if (!ad) return null;

  const handleClick = () => {
    trackClick(ad);
  };

  return (
    <div className={`bg-[#171717] rounded-xl border border-neutral-800/80 hover:border-neutral-700 transition-all p-4 flex flex-col justify-between overflow-hidden relative group ${className}`}>
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800">
        <Sparkles className="w-3 h-3 text-red-500" />
        <span>Promoted</span>
      </div>

      <div className="space-y-3">
        {ad.imageUrl && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-neutral-900">
            <img
              src={ad.imageUrl}
              alt={ad.headline || ad.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div>
          <span className="text-[11px] text-neutral-400 font-medium block mb-1">
            {ad.sponsorName || 'Sponsored Partner'}
          </span>
          <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
            {ad.headline || ad.name}
          </h4>
          {ad.description && (
            <p className="text-xs text-neutral-400 mt-1 line-clamp-3 leading-relaxed">
              {ad.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500">Authorized Sponsor</span>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <span>{ad.callToAction || 'Visit Site'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
