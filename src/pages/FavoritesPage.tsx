import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MoviesContext';
import { MovieGrid } from '../components/MovieGrid';
import { TrailerModal } from '../components/TrailerModal';
import { Movie } from '../types';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites, movies } = useMovies();
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Heart className="w-16 h-16 text-neutral-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Favorites</h2>
        <p className="text-neutral-400 mb-6 max-w-sm">
          Save your favorite Bangla, Hindi, and international movies by signing into your account.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-lg shadow-red-950/40"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const favoriteMovies = movies.filter((m) =>
    favorites.some((f) => f.movieId === m.id)
  );

  return (
    <div className="bg-[#080808] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-neutral-800/80 pb-6">
          <Link
            to="/movies"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Catalog
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display flex items-center gap-3">
                <Heart className="w-7 h-7 sm:w-9 sm:h-9 text-red-500 fill-current" />
                My Favorite Movies
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                You have {favoriteMovies.length} saved titles in your library.
              </p>
            </div>
          </div>
        </div>

        <MovieGrid
          movies={favoriteMovies}
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
          emptyMessage="You haven't added any movies to your favorites list yet. Click the heart icon on any movie card to add it here."
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
