import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Movie, FavoriteItem, WatchHistoryItem } from '../types';
import {
  fetchAllMovies,
  fetchUserFavorites,
  toggleFavorite as apiToggleFavorite,
  fetchUserWatchHistory,
  addWatchHistoryRecord,
  clearUserWatchHistory,
  createMovie,
  updateMovie,
  deleteMovie,
  seedDatabase,
  incrementMovieViews
} from '../firebase/services';
import { useAuth } from './AuthContext';

interface MoviesContextType {
  movies: Movie[];
  loading: boolean;
  favorites: FavoriteItem[];
  watchHistory: WatchHistoryItem[];
  refreshMovies: () => Promise<void>;
  getMovieByIdOrSlug: (idOrSlug: string) => Movie | undefined;
  isFavorite: (movieId: string) => boolean;
  toggleFav: (movie: Movie) => Promise<boolean>;
  recordWatch: (movie: Movie, quality: string, progress?: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  addMovie: (movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => Promise<Movie>;
  editMovie: (id: string, updates: Partial<Movie>) => Promise<Movie | null>;
  removeMovie: (id: string) => Promise<boolean>;
  resetToDefaultSeed: () => Promise<void>;
  incrementViews: (movieId: string) => void;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  const loadMovies = useCallback(async () => {
    try {
      const data = await fetchAllMovies();
      setMovies(data);
    } catch (e) {
      console.error('Failed to load movies', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Load user data when user changes
  useEffect(() => {
    if (user?.uid) {
      fetchUserFavorites(user.uid).then(setFavorites);
      fetchUserWatchHistory(user.uid).then(setWatchHistory);
    } else {
      setFavorites([]);
      setWatchHistory([]);
    }
  }, [user?.uid]);

  const getMovieByIdOrSlug = (idOrSlug: string) => {
    return movies.find(m => m.slug === idOrSlug || m.id === idOrSlug);
  };

  const isFavorite = (movieId: string) => {
    return favorites.some(f => f.movieId === movieId);
  };

  const toggleFav = async (movie: Movie) => {
    if (!user) {
      throw new Error('Please login to save to favorites');
    }
    const added = await apiToggleFavorite(user.uid, movie);
    const updated = await fetchUserFavorites(user.uid);
    setFavorites(updated);
    return added;
  };

  const recordWatch = async (movie: Movie, quality: string, progress: number = 0) => {
    if (user) {
      await addWatchHistoryRecord(user.uid, movie, quality, progress);
      const updated = await fetchUserWatchHistory(user.uid);
      setWatchHistory(updated);
    }
    incrementMovieViews(movie.id);
  };

  const clearHistory = async () => {
    if (user) {
      await clearUserWatchHistory(user.uid);
      setWatchHistory([]);
    }
  };

  const addMovie = async (movieData: Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    const created = await createMovie({ ...movieData, views: 0 });
    await loadMovies();
    return created;
  };

  const editMovie = async (id: string, updates: Partial<Movie>) => {
    const updated = await updateMovie(id, updates);
    await loadMovies();
    return updated;
  };

  const removeMovie = async (id: string) => {
    const success = await deleteMovie(id);
    await loadMovies();
    return success;
  };

  const resetToDefaultSeed = async () => {
    await seedDatabase();
    await loadMovies();
  };

  const incrementViews = (movieId: string) => {
    incrementMovieViews(movieId);
    setMovies(prev => prev.map(m => m.id === movieId ? { ...m, views: (m.views || 0) + 1 } : m));
  };

  return (
    <MoviesContext.Provider
      value={{
        movies,
        loading,
        favorites,
        watchHistory,
        refreshMovies: loadMovies,
        getMovieByIdOrSlug,
        isFavorite,
        toggleFav,
        recordWatch,
        clearHistory,
        addMovie,
        editMovie,
        removeMovie,
        resetToDefaultSeed,
        incrementViews
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
};
