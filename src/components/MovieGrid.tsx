import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onPlayTrailer?: (movie: Movie) => void;
  emptyMessage?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  onPlayTrailer,
  emptyMessage = 'No movies found matching your selection.'
}) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="py-16 text-center bg-[#171717]/40 rounded-2xl border border-neutral-800/80 p-8 my-6">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-400">
          🎬
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Titles Found</h3>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
      {movies.map((movie) => (
        <div key={movie.id} className="h-full">
          <MovieCard movie={movie} onPlayTrailer={onPlayTrailer} />
        </div>
      ))}
    </div>
  );
};
