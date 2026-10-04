import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart, Film } from 'lucide-react';
import { Movie } from '../types';
import { useMovies } from '../context/MoviesContext';
import { useAuth } from '../context/AuthContext';

interface MovieCardProps {
  movie: Movie;
  onPlayTrailer?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlayTrailer }) => {
  const { isFavorite, toggleFav } = useMovies();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const favorited = isFavorite(movie.id);

  // Highest quality badge
  const highestQuality = movie.qualities && movie.qualities.length > 0
    ? movie.qualities.reduce((prev, curr) => {
        const order = { '480P': 1, '720P': 2, '1080P': 3, '4K': 4 };
        return (order[curr.quality] || 0) > (order[prev.quality] || 0) ? curr : prev;
      }, movie.qualities[0]).quality
    : 'HD';

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to add movies to your favorites.');
      return;
    }
    setFavLoading(true);
    try {
      await toggleFav(movie);
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(movie);
    }
  };

  return (
    <div className="group relative bg-[#171717] rounded-xl overflow-hidden border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20 flex flex-col h-full">
      {/* Poster Media Box (3:4 aspect ratio) */}
      <Link
        to={`/movie/${movie.slug || movie.id}`}
        className="relative block aspect-[2/3] w-full overflow-hidden bg-neutral-900"
      >
        {/* Quality Badge */}
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="bg-red-600/90 text-white text-[11px] font-black px-2 py-0.5 rounded shadow-md tracking-wider">
            {highestQuality}
          </span>
        </div>

        {/* Favorite Icon Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            favorited
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-black/60 text-white/80 hover:bg-black/80 hover:text-white backdrop-blur-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Poster Image with fallback */}
        {!imageError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-900 to-neutral-800 text-center">
            <Film className="w-10 h-10 text-neutral-600 mb-2" />
            <span className="text-xs font-semibold text-neutral-400 line-clamp-2">{movie.title}</span>
          </div>
        )}

        {/* Cinematic Scrim Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

        {/* Hover Action Center Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          {movie.trailerUrl && (
            <button
              onClick={handleTrailerClick}
              className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
              title="Watch Trailer"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          )}
        </div>
      </Link>

      {/* Card Info Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5 font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <span>{movie.releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-300 truncate">{movie.language}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/movie/${movie.slug || movie.id}`}
            className="block text-sm font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-snug"
            title={movie.title}
          >
            {movie.title}
          </Link>

          {/* Genre line */}
          <p className="text-xs text-neutral-500 mt-1 truncate">
            {movie.genres.join(', ')}
          </p>
        </div>

        {/* Bottom Details link */}
        <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            {movie.duration}
          </span>
          <Link
            to={`/movie/${movie.slug || movie.id}`}
            className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
