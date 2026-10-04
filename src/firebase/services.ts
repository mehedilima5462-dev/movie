import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Movie, FavoriteItem, WatchHistoryItem, UserProfile } from '../types';
import { SEED_MOVIES } from '../data/seedMovies';

const LOCAL_MOVIES_KEY = 'moviehub_movies_data';
const LOCAL_FAVORITES_KEY = 'moviehub_favorites_data';
const LOCAL_HISTORY_KEY = 'moviehub_history_data';

// Helper for local persistence
function getStoredMovies(): Movie[] {
  try {
    const raw = localStorage.getItem(LOCAL_MOVIES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local movies storage', e);
  }
  localStorage.setItem(LOCAL_MOVIES_KEY, JSON.stringify(SEED_MOVIES));
  return SEED_MOVIES;
}

function saveStoredMovies(movies: Movie[]) {
  try {
    localStorage.setItem(LOCAL_MOVIES_KEY, JSON.stringify(movies));
  } catch (e) {
    console.error('Error saving local movies storage', e);
  }
}

// Fetch all movies (Firestore or Local)
export async function fetchAllMovies(): Promise<Movie[]> {
  if (isFirebaseConfigured && db) {
    try {
      const moviesCol = collection(db, 'movies');
      const q = query(moviesCol, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
      } else {
        // If Firestore is empty, seed it with initial movies
        await seedDatabase();
        return SEED_MOVIES;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, falling back to local dataset', err);
      return getStoredMovies();
    }
  }
  return getStoredMovies();
}

// Fetch single movie by slug or ID
export async function fetchMovieBySlugOrId(slugOrId: string): Promise<Movie | null> {
  if (isFirebaseConfigured && db) {
    try {
      // First try by ID
      const docRef = doc(db, 'movies', slugOrId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Movie;
      }

      // Try by slug
      const moviesCol = collection(db, 'movies');
      const q = query(moviesCol, where('slug', '==', slugOrId));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const first = querySnap.docs[0];
        return { id: first.id, ...first.data() } as Movie;
      }
    } catch (err) {
      console.warn('Firestore single movie fetch failed, checking local', err);
    }
  }

  const all = getStoredMovies();
  return all.find(m => m.slug === slugOrId || m.id === slugOrId) || null;
}

// Increment movie views
export async function incrementMovieViews(movieId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'movies', movieId);
      await updateDoc(docRef, {
        views: increment(1)
      });
      return;
    } catch (err) {
      console.warn('Failed to increment views on Firestore', err);
    }
  }

  const all = getStoredMovies();
  const updated = all.map(m => m.id === movieId ? { ...m, views: (m.views || 0) + 1 } : m);
  saveStoredMovies(updated);
}

// Admin: Add Movie
export async function createMovie(movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Promise<Movie> {
  const id = movie.slug || `movie-${Date.now()}`;
  const now = new Date().toISOString();
  const newMovie: Movie = {
    ...movie,
    id,
    createdAt: now,
    updatedAt: now,
    views: 0
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'movies', id);
      await setDoc(docRef, newMovie);
    } catch (err) {
      console.error('Failed to create movie in Firestore', err);
    }
  }

  // Always update local cache
  const all = getStoredMovies();
  const updated = [newMovie, ...all.filter(m => m.id !== id)];
  saveStoredMovies(updated);
  return newMovie;
}

// Admin: Update Movie
export async function updateMovie(id: string, updates: Partial<Movie>): Promise<Movie | null> {
  const now = new Date().toISOString();
  const payload = {
    ...updates,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'movies', id);
      await updateDoc(docRef, payload);
    } catch (err) {
      console.error('Failed to update movie in Firestore', err);
    }
  }

  const all = getStoredMovies();
  const existing = all.find(m => m.id === id);
  if (!existing) return null;

  const updatedMovie: Movie = {
    ...existing,
    ...payload,
    id
  };
  const updatedList = all.map(m => m.id === id ? updatedMovie : m);
  saveStoredMovies(updatedList);
  return updatedMovie;
}

// Admin: Delete Movie
export async function deleteMovie(id: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'movies', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete movie from Firestore', err);
    }
  }

  const all = getStoredMovies();
  const updated = all.filter(m => m.id !== id);
  saveStoredMovies(updated);
  return true;
}

// Admin: Seed or Reset Database
export async function seedDatabase(): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const batch = writeBatch(db);
      for (const m of SEED_MOVIES) {
        const ref = doc(db, 'movies', m.id);
        batch.set(ref, m);
      }
      await batch.commit();
      console.log('Database seeded successfully in Firestore');
    } catch (e) {
      console.error('Firestore batch seed failed', e);
    }
  }
  saveStoredMovies(SEED_MOVIES);
}

// Favorites management
export async function fetchUserFavorites(userId: string): Promise<FavoriteItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const favsCol = collection(db, 'favorites');
      const q = query(favsCol, where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as FavoriteItem));
    } catch (e) {
      console.warn('Failed to load favorites from Firestore, using local', e);
    }
  }

  try {
    const raw = localStorage.getItem(`${LOCAL_FAVORITES_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function toggleFavorite(userId: string, movie: Movie): Promise<boolean> {
  const currentFavs = await fetchUserFavorites(userId);
  const existing = currentFavs.find(f => f.movieId === movie.id);
  const isAdding = !existing;

  if (isFirebaseConfigured && db) {
    try {
      const favDocId = `${userId}_${movie.id}`;
      const docRef = doc(db, 'favorites', favDocId);
      if (isAdding) {
        const newFav: FavoriteItem = {
          id: favDocId,
          userId,
          movieId: movie.id,
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
          releaseYear: movie.releaseYear,
          rating: movie.rating,
          language: movie.language,
          addedAt: new Date().toISOString()
        };
        await setDoc(docRef, newFav);
      } else {
        await deleteDoc(docRef);
      }
    } catch (e) {
      console.warn('Firestore toggle favorite error, persisting locally', e);
    }
  }

  let updatedFavs: FavoriteItem[];
  if (isAdding) {
    const newFav: FavoriteItem = {
      id: `${userId}_${movie.id}`,
      userId,
      movieId: movie.id,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      releaseYear: movie.releaseYear,
      rating: movie.rating,
      language: movie.language,
      addedAt: new Date().toISOString()
    };
    updatedFavs = [newFav, ...currentFavs];
  } else {
    updatedFavs = currentFavs.filter(f => f.movieId !== movie.id);
  }

  localStorage.setItem(`${LOCAL_FAVORITES_KEY}_${userId}`, JSON.stringify(updatedFavs));
  return isAdding;
}

// Watch History Management
export async function fetchUserWatchHistory(userId: string): Promise<WatchHistoryItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const historyCol = collection(db, 'watchHistory');
      const q = query(historyCol, where('userId', '==', userId), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as WatchHistoryItem));
    } catch (e) {
      console.warn('Failed to fetch watch history from Firestore', e);
    }
  }

  try {
    const raw = localStorage.getItem(`${LOCAL_HISTORY_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function addWatchHistoryRecord(
  userId: string,
  movie: Movie,
  quality: string,
  progressPercentage: number = 0
): Promise<void> {
  const historyId = `${userId}_${movie.id}`;
  const record: WatchHistoryItem = {
    id: historyId,
    userId,
    movieId: movie.id,
    movieTitle: movie.title,
    posterUrl: movie.posterUrl,
    quality,
    progressPercentage,
    timestamp: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'watchHistory', historyId);
      await setDoc(docRef, record);
    } catch (e) {
      console.warn('Failed to write watch history to Firestore', e);
    }
  }

  const current = await fetchUserWatchHistory(userId);
  const updated = [record, ...current.filter(h => h.movieId !== movie.id)].slice(0, 30);
  localStorage.setItem(`${LOCAL_HISTORY_KEY}_${userId}`, JSON.stringify(updated));
}

export async function clearUserWatchHistory(userId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const historyCol = collection(db, 'watchHistory');
      const q = query(historyCol, where('userId', '==', userId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {
      console.warn('Error clearing watch history in Firestore', e);
    }
  }

  localStorage.removeItem(`${LOCAL_HISTORY_KEY}_${userId}`);
}

// User Profile Management in Firestore
export async function syncUserProfile(profile: UserProfile): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', profile.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, profile);
      } else {
        // preserve existing role
        const data = snap.data();
        await updateDoc(userRef, {
          displayName: profile.displayName,
          email: profile.email,
          photoURL: profile.photoURL || data.photoURL || ''
        });
      }
    } catch (e) {
      console.warn('Failed to sync user profile with Firestore', e);
    }
  }
}
