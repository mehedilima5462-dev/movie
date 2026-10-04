import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Users,
  Eye,
  Heart,
  TrendingUp,
  PlusCircle,
  Database,
  ArrowRight,
  UploadCloud,
  Megaphone,
  Percent,
  Sparkles
} from 'lucide-react';
import { useMovies } from '../../context/MoviesContext';
import { useAds } from '../../context/AdsContext';

export const AdminDashboardPage: React.FC = () => {
  const { movies, resetToDefaultSeed } = useMovies();
  const { ads } = useAds();

  // Calculate live stats
  const totalMovies = movies.length;
  const totalViews = movies.reduce((acc, m) => acc + (m.views || 0), 0);
  const totalUsers = 142; // simulated / registered count
  const estimatedFavorites = Math.round(totalViews * 0.12);

  // Ads stats
  const totalAdImpressions = ads.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalAdClicks = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const averageCtr = totalAdImpressions > 0 ? (totalAdClicks / totalAdImpressions) * 100 : 0;
  const activeAdsCount = ads.filter((a) => a.active).length;

  const mostViewedMovie = [...movies].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
  const latestMovies = [...movies].slice(0, 5);

  const handleSeedReset = async () => {
    if (window.confirm('Reset database to 20 fictional seed titles? Custom additions will be overwritten.')) {
      await resetToDefaultSeed();
      alert('Database successfully reset to seed data!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Admin Command Center
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Manage movie uploading, catalog publishing, and advertisement campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedReset}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors"
            title="Seed initial 20 fictional movies into Firestore / LocalStorage"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Seed / Reset Data
          </button>

          <Link
            to="/admin/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-950/40 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Studio
          </Link>
        </div>
      </div>

      {/* 3 Core System Launchpads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Launchpad 1: Movie Upload Studio */}
        <div className="bg-gradient-to-br from-red-950/40 via-[#151515] to-[#121212] p-6 rounded-2xl border border-red-900/40 space-y-4 hover:border-red-600/60 transition-all group shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 border border-red-800/40 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
              Movie Upload Studio
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Drag-and-drop video masters, auto-encode 480P/720P/1080P/4K bitrates, upload high-res posters, and ingest via Bulk JSON.
            </p>
          </div>
          <Link
            to="/admin/upload"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
          >
            Launch Upload Studio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Launchpad 2: Movie Catalog Management */}
        <div className="bg-gradient-to-br from-neutral-900 via-[#151515] to-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-4 hover:border-neutral-700 transition-all group shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-800/40 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Movie Catalog Manager
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Manage {totalMovies} published titles, edit metadata, view counters, delete with confirmation, and configure authorized qualities.
            </p>
          </div>
          <Link
            to="/admin/movies"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Manage All Movies <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Launchpad 3: Ads Manager */}
        <div className="bg-gradient-to-br from-amber-950/30 via-[#151515] to-[#121212] p-6 rounded-2xl border border-amber-900/30 space-y-4 hover:border-amber-600/60 transition-all group shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-800/40 flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Ads &amp; Campaign Center
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Configure banners, native ads, pre-stream interstitials, device targeting, impression caps, and track real-time CTR.
            </p>
          </div>
          <Link
            to="/admin/ads"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Open Ads Manager <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>


      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Movies</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-red-500">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalMovies}
          </div>
          <p className="text-xs text-emerald-400">Active titles published</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-amber-500">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-400">Stream preview plays</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalUsers}
          </div>
          <p className="text-xs text-neutral-400">Registered member profiles</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Favorites</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-rose-500">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {estimatedFavorites.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-400">Saved across all libraries</p>
        </div>
      </div>

      {/* Most Viewed Spotlight Card */}
      {mostViewedMovie && (
        <div className="bg-gradient-to-r from-red-950/30 via-[#141414] to-[#141414] p-6 rounded-2xl border border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={mostViewedMovie.posterUrl}
              alt={mostViewedMovie.title}
              className="w-16 h-24 object-cover rounded-lg bg-neutral-900 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-red-400 font-semibold mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>#1 Most Viewed Title</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {mostViewedMovie.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {mostViewedMovie.releaseYear} · {mostViewedMovie.language} · {mostViewedMovie.duration}
              </p>
              <div className="text-xs text-neutral-300 font-mono mt-1">
                <strong className="text-white">{(mostViewedMovie.views || 0).toLocaleString()}</strong> total views
              </div>
            </div>
          </div>

          <Link
            to={`/admin/movies/edit/${mostViewedMovie.id}`}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
          >
            Edit Record
          </Link>
        </div>
      )}

      {/* Latest Movies Table */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white">
            Recently Added / Updated Titles
          </h2>
          <Link
            to="/admin/movies"
            className="text-xs text-red-500 hover:text-red-400 font-semibold flex items-center gap-1"
          >
            View Full Table <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 bg-neutral-900/40">
              <tr>
                <th className="py-3 px-4">Movie</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {latestMovies.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      className="w-8 h-12 object-cover rounded bg-neutral-950 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate max-w-[180px]">
                        {m.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {m.genres.join(', ')}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{m.language}</td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono">{m.releaseYear}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-amber-400 font-bold font-mono">
                    ★ {m.rating.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono">
                    {(m.views || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      {m.status || 'published'}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                    <Link
                      to={`/admin/movies/edit/${m.id}`}
                      className="text-xs text-neutral-300 hover:text-white underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
