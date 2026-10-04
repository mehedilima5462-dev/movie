import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovies } from '../context/MoviesContext';
import { MovieGrid } from '../components/MovieGrid';
import { TrailerModal } from '../components/TrailerModal';
import { AdBanner } from '../components/ads/AdBanner';
import { ArrowLeft } from 'lucide-react';
import { Movie } from '../types';

interface CategoryPageProps {
  type: 'category' | 'genre' | 'year';
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ type }) => {
  const params = useParams();
  const rawParam = params.category || params.genre || params.year || '';
  const { movies } = useMovies();
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  // Normalize human title
  const title = useMemo(() => {
    if (!rawParam) return 'Browse';
    if (type === 'year') return `Year ${rawParam} Releases`;
    if (rawParam === 'south-indian') return 'South Indian Cinema';
    if (rawParam === 'web-series') return 'Original Web Series';
    return `${rawParam.charAt(0).toUpperCase() + rawParam.slice(1)} Titles`;
  }, [rawParam, type]);

  const filteredMovies = useMemo(() => {
    if (!rawParam) return movies;
    const p = rawParam.toLowerCase();

    if (type === 'year') {
      return movies.filter((m) => m.releaseYear.toString() === p);
    }

    if (type === 'genre') {
      return movies.filter((m) =>
        m.genres.some((g) => g.toLowerCase() === p)
      );
    }

    // category
    if (p === 'south-indian') {
      return movies.filter((m) =>
        ['tamil', 'telugu', 'malayalam', 'kannada'].includes(m.language.toLowerCase())
      );
    }
    if (p === 'web-series') {
      return movies.filter((m) => m.type === 'web-series');
    }
    return movies.filter((m) => m.language.toLowerCase() === p);
  }, [movies, rawParam, type]);

  return (
    <div className="bg-[#080808] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Title */}
        <div className="border-b border-neutral-800/80 pb-6">
          <Link
            to="/movies"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Movies
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                {title}
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                Showing {filteredMovies.length} authorized titles in this collection.
              </p>
            </div>
          </div>
        </div>

        {/* Placement: category_top */}
        <AdBanner placement="category_top" />

        {/* Movies Grid */}
        <MovieGrid
          movies={filteredMovies}
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
          emptyMessage={`No titles currently listed under "${title}".`}
        />

      </div>

      <TrailerModal
        movie={activeTrailerMovie}
        isOpen={Boolean(activeTrailerMovie)}
        onClose={() => setActiveTrailerMovie(null)}
      />
    </div>
  );
};
