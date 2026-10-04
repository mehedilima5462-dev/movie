import React, { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { AdPlacement } from '../../types';
import { useAds } from '../../context/AdsContext';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
  format?: 'leaderboard' | 'billboard' | 'responsive' | 'mobile';
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  className = '',
  format = 'responsive'
}) => {
  const { getAdForPlacement, trackImpression, trackClick } = useAds();
  const ad = getAdForPlacement(placement);
  const impressionRecorded = useRef(false);

  useEffect(() => {
    if (ad && !impressionRecorded.current) {
      impressionRecorded.current = true;
      trackImpression(ad);
    }
  }, [ad, trackImpression]);

  // If no active advertisement exists, render NOTHING and leave NO empty space!
  if (!ad) return null;

  const handleClick = () => {
    trackClick(ad);
  };

  return (
    <div className={`w-full my-4 flex flex-col items-center justify-center ${className}`}>
      {/* Quiet unboxed sponsored label */}
      <div className="w-full max-w-5xl flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest px-2 pb-1 font-mono">
        <span>Advertisement · {ad.sponsorName || 'Authorized Sponsor'}</span>
        <span className="hover:text-neutral-300 transition-colors">Sponsored</span>
      </div>

      <div className="w-full max-w-5xl bg-[#141414] border border-neutral-800/80 rounded-xl overflow-hidden shadow-lg group relative">
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="block w-full"
        >
          {ad.imageUrl ? (
            <div className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 p-3 sm:p-4 gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={ad.imageUrl}
                  alt={ad.headline || ad.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-neutral-950 shrink-0 border border-neutral-800"
                />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {ad.headline || ad.name}
                  </h4>
                  {ad.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 max-w-xl">
                      {ad.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-4 py-2 rounded-lg bg-red-600 group-hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap">
                  <span>{ad.callToAction || 'Learn More'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ) : ad.adCode ? (
            /* Safe rendered code */
            <div
              className="p-4 text-center text-xs text-neutral-300"
              dangerouslySetInnerHTML={{ __html: ad.adCode }}
            />
          ) : (
            <div className="p-4 text-center bg-neutral-900">
              <p className="text-sm font-semibold text-white">{ad.name}</p>
              <p className="text-xs text-neutral-400 mt-1">{ad.description}</p>
            </div>
          )}
        </a>
      </div>
    </div>
  );
};
