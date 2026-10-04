import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, Film } from 'lucide-react';
import { useMovies } from '../../context/MoviesContext';
import { MovieQuality, VideoQuality, MovieStatus, ContentType, Movie } from '../../types';
import { GENRES_LIST, LANGUAGES_LIST } from '../../data/seedMovies';

export const AdminEditMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieByIdOrSlug, editMovie } = useMovies();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState<number>(2026);
  const [language, setLanguage] = useState('Bangla');
  const [country, setCountry] = useState('Bangladesh');
  const [duration, setDuration] = useState('2h 15m');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [rating, setRating] = useState<number>(8.5);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [status, setStatus] = useState<MovieStatus>('published');
  const [type, setType] = useState<ContentType>('movie');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [qualities, setQualities] = useState<MovieQuality[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getMovieByIdOrSlug(id);
      if (found) {
        setMovie(found);
        setTitle(found.title);
        setSlug(found.slug);
        setPosterUrl(found.posterUrl);
        setBackdropUrl(found.backdropUrl);
        setTrailerUrl(found.trailerUrl);
        setDescription(found.description);
        setReleaseYear(found.releaseYear);
        setLanguage(found.language);
        setCountry(found.country);
        setDuration(found.duration);
        setDirector(found.director);
        setCast(found.cast ? found.cast.join(', ') : '');
        setRating(found.rating);
        setFeatured(found.featured);
        setTrending(found.trending);
        setStatus(found.status || 'published');
        setType(found.type || 'movie');
        setSelectedGenres(found.genres || []);
        setQualities(found.qualities || []);
      }
    }
  }, [id, getMovieByIdOrSlug]);

  if (!movie) {
    return (
      <div className="py-16 text-center text-neutral-400">
        <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <h2 className="text-xl font-bold text-white mb-2">Movie Not Found</h2>
        <Link to="/admin/movies" className="text-xs text-red-500 underline">
          Back to Movies
        </Link>
      </div>
    );
  }

  const handleGenreToggle = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const addQualityRow = () => {
    setQualities([
      ...qualities,
      {
        quality: '1080P',
        fileSize: '2.0 GB',
        watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        authorized: true,
        format: 'MP4'
      }
    ]);
  };

  const removeQualityRow = (index: number) => {
    setQualities(qualities.filter((_, idx) => idx !== index));
  };

  const updateQualityRow = (index: number, field: keyof MovieQuality, value: any) => {
    const updated = [...qualities];
    updated[index] = { ...updated[index], [field]: value };
    setQualities(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const castArray = cast
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      await editMovie(movie.id, {
        title,
        slug,
        posterUrl,
        backdropUrl,
        trailerUrl,
        description,
        releaseYear: Number(releaseYear),
        language,
        country,
        duration,
        genres: selectedGenres,
        director,
        cast: castArray,
        rating: Number(rating),
        featured,
        trending,
        status,
        type,
        qualities
      });

      navigate('/admin/movies');
    } catch (err: any) {
      alert('Error updating movie: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <Link
          to="/admin/movies"
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Movies
        </Link>
        <span className="text-xs text-neutral-500 font-mono">Editing: {movie.id}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Edit: {movie.title}
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Update movie metadata, streaming sources, or publication status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* General Details */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
            General Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Movie Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Release Year
              </label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              >
                {LANGUAGES_LIST.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Director
              </label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Cast
              </label>
              <input
                type="text"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES_LIST.map((g) => {
                const selected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGenreToggle(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selected
                        ? 'bg-red-600 text-white font-semibold'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {selected ? '✓ ' : ''}{g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Media URLs */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
            Media &amp; Artwork
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Poster Image URL
              </label>
              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Backdrop Banner URL
              </label>
              <input
                type="text"
                value={backdropUrl}
                onChange={(e) => setBackdropUrl(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Trailer Video URL
            </label>
            <input
              type="text"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
            />
          </div>
        </div>

        {/* Quality Streams List */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-base font-bold text-white">
              Authorized Qualities
            </h2>
            <button
              type="button"
              onClick={addQualityRow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Quality
            </button>
          </div>

          <div className="space-y-4">
            {qualities.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                    {q.quality} Quality
                  </span>
                  {qualities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQualityRow(idx)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Resolution</label>
                    <select
                      value={q.quality}
                      onChange={(e) => updateQualityRow(idx, 'quality', e.target.value)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="480P">480P</option>
                      <option value="720P">720P</option>
                      <option value="1080P">1080P</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">File Size</label>
                    <input
                      type="text"
                      value={q.fileSize}
                      onChange={(e) => updateQualityRow(idx, 'fileSize', e.target.value)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Format</label>
                    <select
                      value={q.format || 'MP4'}
                      onChange={(e) => updateQualityRow(idx, 'format', e.target.value)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="MP4">MP4</option>
                      <option value="MKV">MKV</option>
                      <option value="WebM">WebM</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={q.authorized}
                        onChange={(e) => updateQualityRow(idx, 'authorized', e.target.checked)}
                        className="rounded text-red-600 focus:ring-0 bg-neutral-800"
                      />
                      <span>Authorized</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Watch Stream URL</label>
                    <input
                      type="text"
                      value={q.watchUrl}
                      onChange={(e) => updateQualityRow(idx, 'watchUrl', e.target.value)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Download Source URL</label>
                    <input
                      type="text"
                      value={q.downloadUrl}
                      onChange={(e) => updateQualityRow(idx, 'downloadUrl', e.target.value)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status flags */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
            Status &amp; Flags
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MovieStatus)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white"
              >
                <option value="movie">Movie</option>
                <option value="web-series">Web Series</option>
              </select>
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-red-600 focus:ring-0 bg-neutral-800"
                />
                <span>Featured</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-white cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  className="rounded text-red-600 focus:ring-0 bg-neutral-800"
                />
                <span>Trending</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-800">
          <Link
            to="/admin/movies"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-red-950/40 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};
