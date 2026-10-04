import React from 'react';
import { X, Film } from 'lucide-react';
import { Movie } from '../types';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ movie, isOpen, onClose }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-[#141414] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-red-500" />
            <h3 className="text-sm sm:text-base font-semibold text-white truncate">
              Trailer: {movie.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Container (16:9) */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {movie.trailerUrl ? (
            <video
              src={movie.trailerUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-8 text-neutral-400">
              <p>Official trailer stream currently processing.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#141414] flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
          <div>
            <span className="text-white font-medium">{movie.title}</span> ({movie.releaseYear}) · {movie.language}
          </div>
          <div className="text-emerald-400">
            Official Authorized Preview Stream
          </div>
        </div>
      </div>
    </div>
  );
};
