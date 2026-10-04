import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Clock, Film, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MoviesContext';
import { MovieGrid } from '../components/MovieGrid';

export const ProfilePage: React.FC = () => {
  const { user, isAdmin, toggleAdminDemoRole } = useAuth();
  const { favorites, watchHistory, movies, clearHistory } = useMovies();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'history'>('profile');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <User className="w-16 h-16 text-neutral-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
        <p className="text-neutral-400 mb-6 max-w-sm">
          You must be logged in to view your user dashboard, saved favorites, and streaming history.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-lg shadow-red-950/40"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // Get full movie objects for favorites
  const favoriteMovies = movies.filter((m) =>
    favorites.some((f) => f.movieId === m.id)
  );

  return (
    <div className="bg-[#080808] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Header Profile Card */}
        <div className="bg-[#141414] rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-red-950/40 uppercase">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user.displayName || 'Movie Enthusiast'}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {user.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">{user.email}</p>
              <div className="text-xs text-neutral-500 mt-2">
                Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={toggleAdminDemoRole}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs text-neutral-300 font-medium transition-colors"
              title="Toggle role between user and admin"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              Role: {user.role === 'admin' ? 'Demote to User' : 'Elevate to Admin'}
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls (Interactive Filter Controls) */}
        <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-red-500" />
            Favorites ({favoriteMovies.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            Watch History ({watchHistory.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#171717] p-6 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Saved Favorites
              </span>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {favoriteMovies.length}
              </div>
              <p className="text-xs text-neutral-500">
                Titles saved to your personal library.
              </p>
            </div>

            <div className="bg-[#171717] p-6 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Streaming History
              </span>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {watchHistory.length}
              </div>
              <p className="text-xs text-neutral-500">
                Authorized videos played or downloaded.
              </p>
            </div>

            <div className="bg-[#171717] p-6 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Playback Tier
              </span>
              <div className="text-2xl font-bold text-red-500">
                Full 4K UHD
              </div>
              <p className="text-xs text-neutral-500">
                Authorized access across all bitrates.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Your Saved Favorites</h2>
              <span className="text-xs text-neutral-400 font-mono">
                {favoriteMovies.length} titles
              </span>
            </div>
            <MovieGrid
              movies={favoriteMovies}
              emptyMessage="You have not saved any titles to your favorites yet. Click the heart icon on any movie card to add it here."
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent Watch &amp; Stream Activity</h2>
              {watchHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear History
                </button>
              )}
            </div>

            {watchHistory.length > 0 ? (
              <div className="space-y-3">
                {watchHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#171717] border border-neutral-800 hover:border-neutral-700 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.posterUrl}
                        alt={item.movieTitle}
                        className="w-12 h-16 object-cover rounded bg-neutral-900 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/movie/${item.movieId}`}
                          className="text-sm font-semibold text-white hover:text-red-400 transition-colors"
                        >
                          {item.movieTitle}
                        </Link>
                        <div className="text-xs text-neutral-400 flex items-center gap-2 mt-1">
                          <span className="bg-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {item.quality}
                          </span>
                          <span>·</span>
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/movie/${item.movieId}`}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 hover:text-white font-medium transition-colors"
                    >
                      Watch Again
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-neutral-400 bg-[#171717]/40 rounded-2xl border border-neutral-800 p-8">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Your watch history is currently empty.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
