import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  Film,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UploadCloud
} from 'lucide-react';
import { useMovies } from '../../context/MoviesContext';
import { Movie } from '../../types';

export const AdminMoviesPage: React.FC = () => {
  const { movies, removeMovie } = useMovies();
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.director.toLowerCase().includes(search.toLowerCase()) ||
        m.genres.some((g) => g.toLowerCase().includes(search.toLowerCase()));

      const matchLang =
        filterLang === 'all' || m.language.toLowerCase() === filterLang.toLowerCase();

      const matchStatus =
        filterStatus === 'all' || (m.status || 'published') === filterStatus;

      return matchSearch && matchLang && matchStatus;
    });
  }, [movies, search, filterLang, filterStatus]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeMovie(deleteTarget.id);
      showToast(`"${deleteTarget.title}" was removed successfully.`);
      setDeleteTarget(null);
    } catch (e) {
      alert('Failed to delete movie.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Manage Movies
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Total {filtered.length} titles in repository.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/admin/upload"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-red-500" />
            Upload Video
          </Link>

          <Link
            to="/admin/movies/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-red-950/40 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add Movie
          </Link>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#141414] p-4 rounded-xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, director, genre..."
            className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterLang}
            onChange={(e) => {
              setFilterLang(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Languages</option>
            <option value="bangla">Bangla</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Movie Table */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Title &amp; Poster</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Qualities</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {paginated.length > 0 ? (
                paginated.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-9 h-13 object-cover rounded bg-neutral-950 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/movie/${m.slug || m.id}`}
                          className="font-semibold text-white hover:text-red-400 transition-colors block truncate max-w-[200px]"
                        >
                          {m.title}
                        </Link>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                          {m.genres.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{m.language}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">{m.releaseYear}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-amber-400 font-bold font-mono">
                      ★ {m.rating.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {m.qualities?.map((q) => (
                          <span
                            key={q.quality}
                            className="bg-neutral-800 text-[10px] font-bold px-1.5 py-0.5 rounded text-neutral-300"
                          >
                            {q.quality}
                          </span>
                        ))}
                      </div>
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
                        to={`/movie/${m.slug || m.id}`}
                        target="_blank"
                        className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 inline-block"
                        title="View Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/movies/edit/${m.id}`}
                        className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white inline-block"
                        title="Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(m)}
                        className="p-1.5 rounded bg-neutral-800 hover:bg-red-900/60 text-neutral-400 hover:text-red-300 transition-colors inline-block"
                        title="Delete Movie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No movies match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-800 text-xs text-neutral-400">
            <span>
              Page {currentPage} of {totalPages} ({filtered.length} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-neutral-900 border border-neutral-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded bg-neutral-900 border border-neutral-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171717] border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Confirm Removal</h3>
            </div>
            <p className="text-sm text-neutral-300">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">&ldquo;{deleteTarget.title}&rdquo;</strong>? This will remove all authorized playback links and associated qualities.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Movie'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
