import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Download, Settings } from 'lucide-react';
import { Movie, VideoQuality } from '../types';
import { useMovies } from '../context/MoviesContext';

interface VideoPlayerModalProps {
  movie: Movie | null;
  initialQuality?: VideoQuality;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  movie,
  initialQuality = '1080P',
  isOpen,
  onClose
}) => {
  const { recordWatch } = useMovies();
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(initialQuality);

  useEffect(() => {
    if (initialQuality) {
      setSelectedQuality(initialQuality);
    }
  }, [initialQuality]);

  useEffect(() => {
    if (isOpen && movie) {
      recordWatch(movie, selectedQuality, 10);
    }
  }, [isOpen, movie, selectedQuality]);

  if (!isOpen || !movie) return null;

  const currentQualityObj = movie.qualities?.find(q => q.quality === selectedQuality) || movie.qualities?.[0];
  const streamUrl = currentQualityObj?.watchUrl || movie.trailerUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
              {selectedQuality}
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-white truncate">
              {movie.title}
            </h3>
            <span className="hidden sm:inline text-xs text-neutral-400">· {movie.duration}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Authorized Stream</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {streamUrl ? (
            <video
              key={streamUrl}
              src={streamUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <div className="text-center p-8 text-neutral-400">
              <p>Stream source URL is being initialized by authorized distributor.</p>
            </div>
          )}
        </div>

        {/* Bottom Bar: Quality Switcher & Download Option */}
        <div className="p-4 bg-neutral-900/90 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quality Switch Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Quality:
            </span>
            <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-lg">
              {movie.qualities?.map((q) => (
                <button
                  key={q.quality}
                  onClick={() => setSelectedQuality(q.quality)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedQuality === q.quality
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {q.quality}
                </button>
              ))}
            </div>
            {currentQualityObj && (
              <span className="text-neutral-500 font-mono">({currentQualityObj.fileSize})</span>
            )}
          </div>

          {/* Authorized Download */}
          {currentQualityObj?.downloadUrl && currentQualityObj.authorized && (
            <a
              href={currentQualityObj.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              Download {selectedQuality} ({currentQualityObj.fileSize})
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
