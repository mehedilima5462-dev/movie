import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
  onPlayTrailer?: (movie: Movie) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  viewAllLink,
  onPlayTrailer
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-red-600 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              {title}
            </h2>
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              ({movies.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-400 px-2 py-1 rounded transition-colors"
              >
                View All &rarr;
              </Link>
            )}

            {/* Desktop Carousel Navigation Arrows */}
            <div className="hidden md:flex items-center gap-1.5 ml-2">
              <button
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Card Scroller for Desktop, Responsive Touch Scroller for Mobile */}
        <div
          ref={rowRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="w-[170px] sm:w-[200px] md:w-[220px] lg:w-[230px] shrink-0 snap-start"
            >
              <MovieCard movie={movie} onPlayTrailer={onPlayTrailer} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
