import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, ShieldCheck } from 'lucide-react';
import { Movie } from '../types';

interface HeroSectionProps {
  movie: Movie;
  onPlayTrailer: (movie: Movie) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movie, onPlayTrailer }) => {
  return (
    <div className="relative w-full min-h-[500px] lg:min-h-[620px] flex items-center bg-[#080808] overflow-hidden">
      {/* Background Poster/Banner with Scrim Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-75"
        />
        {/* Measured Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent w-full lg:w-3/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl space-y-4">
          
          {/* Badge & Rating Line */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <span className="bg-red-600 text-white px-2.5 py-0.5 rounded text-[11px] tracking-wider uppercase">
              Featured Premiere
            </span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {movie.rating.toFixed(1)} Rating
              </span>
              <span>·</span>
              <span>{movie.releaseYear}</span>
              <span>·</span>
              <span>{movie.language}</span>
              <span>·</span>
              <span>{movie.duration}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none font-display text-balance">
            {movie.title}
          </h1>

          {/* Genres Line */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 font-medium">
            <span>{movie.genres.join(' · ')}</span>
            <span className="text-neutral-500">|</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Authorized 4K Stream
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 leading-relaxed max-w-xl">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {movie.trailerUrl && (
              <button
                onClick={() => onPlayTrailer(movie)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-sm shadow-xl shadow-red-950/50 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Trailer
              </button>
            )}

            <Link
              to={`/movie/${movie.slug || movie.id}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white font-semibold text-sm border border-neutral-700/80 hover:border-neutral-600 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4" />
              View Details
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
