import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Film,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useMovies } from '../../context/MoviesContext';
import { MovieQuality, VideoQuality, MovieStatus, ContentType } from '../../types';
import { GENRES_LIST, LANGUAGES_LIST } from '../../data/seedMovies';

export const AdminAddMoviePage: React.FC = () => {
  const navigate = useNavigate();
  const { addMovie } = useMovies();

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
  const [trending, setTrending] = useState(true);
  const [status, setStatus] = useState<MovieStatus>('published');
  const [type, setType] = useState<ContentType>('movie');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'Thriller']);

  const [qualities, setQualities] = useState<MovieQuality[]>([
    {
      quality: '720P',
      fileSize: '950 MB',
      watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      authorized: true,
      format: 'MP4'
    },
    {
      quality: '1080P',
      fileSize: '2.2 GB',
      watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      authorized: true,
      format: 'MP4'
    }
  ]);

  const [saving, setSaving] = useState(false);

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  };

  const handleGenreToggle = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const addQualityRow = () => {
    const defaultQuality: VideoQuality =
      qualities.length === 0 ? '720P' : qualities.length === 1 ? '1080P' : '4K';
    setQualities([
      ...qualities,
      {
        quality: defaultQuality,
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

  // Sample preset images for quick testing
  const handleApplyPresetBanner = (presetNum: number) => {
    if (presetNum === 1) {
      setPosterUrl('/src/assets/images/poster_dhaka_detective_1791033544494.jpg');
      setBackdropUrl('/src/assets/images/hero_dhaka_noir_1791033530244.jpg');
    } else if (presetNum === 2) {
      setPosterUrl('/src/assets/images/poster_monsoon_rhythm_1791033555846.jpg');
      setBackdropUrl('/src/assets/images/poster_monsoon_rhythm_1791033555846.jpg');
    } else {
      setPosterUrl('/src/assets/images/poster_bengal_expedition_1791033567269.jpg');
      setBackdropUrl('/src/assets/images/poster_bengal_expedition_1791033567269.jpg');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      alert('Please fill out the movie title and slug.');
      return;
    }

    setSaving(true);
    try {
      const castArray = cast
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      await addMovie({
        title,
        slug,
        posterUrl: posterUrl || '/src/assets/images/poster_dhaka_detective_1791033544494.jpg',
        backdropUrl: backdropUrl || '/src/assets/images/hero_dhaka_noir_1791033530244.jpg',
        trailerUrl: trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        description,
        releaseYear: Number(releaseYear),
        language,
        country,
        duration,
        genres: selectedGenres,
        director: director || 'Director Name',
        cast: castArray.length > 0 ? castArray : ['Lead Actor', 'Supporting Actor'],
        rating: Number(rating),
        featured,
        trending,
        status,
        type,
        qualities
      });

      navigate('/admin/movies');
    } catch (err: any) {
      alert('Failed to save movie: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <Link
          to="/admin/movies"
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Movies
        </Link>
        <span className="text-xs text-neutral-500 font-mono">Create Movie Record</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Add New Movie
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Specify metadata, media assets, and authorized streaming qualities.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information Section */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Film className="w-4 h-4 text-red-500" /> General Details
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Dhaka Noir: Crimson Rain"
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Slug (URL Path) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dhaka-noir-crimson-rain"
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
                placeholder="2h 15m"
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Rating (1 - 10)
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
                placeholder="e.g. Tanvir Hasan"
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Cast (Comma separated)
              </label>
              <input
                type="text"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                placeholder="e.g. Arifin Shuvoo, Joya Ahsan, Chanchal Chowdhury"
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Description / Synopsis
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive synopsis of the film narrative..."
              className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Genres selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Genres (Select All That Apply)
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

        {/* Media & Artwork URLs */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Media &amp; Artwork
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Fast Preset:</span>
              <button
                type="button"
                onClick={() => handleApplyPresetBanner(1)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Detective
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetBanner(2)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Monsoon
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetBanner(3)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Expedition
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Poster Image URL
              </label>
              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="/src/assets/images/... or https://..."
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
                placeholder="/src/assets/images/... or https://..."
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Authorized Trailer Stream URL (MP4 / WebM)
            </label>
            <input
              type="text"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              placeholder="https://commondatastorage.googleapis.com/... or authorized CDN link"
              className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
            />
          </div>
        </div>

        {/* Quality Streams List */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">
                Authorized Video Qualities &amp; Bitrates
              </h2>
              <p className="text-xs text-neutral-400">
                Define the available resolutions (480P, 720P, 1080P, 4K) with authorized stream and download endpoints.
              </p>
            </div>
            <button
              type="button"
              onClick={addQualityRow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
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
                    Quality Preset #{idx + 1}
                  </span>
                  {qualities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQualityRow(idx)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Quality</label>
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
                      placeholder="e.g. 1.2 GB"
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
                      <span>Authorized Stream</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Stream Watch URL</label>
                    <input
                      type="text"
                      value={q.watchUrl}
                      onChange={(e) => updateQualityRow(idx, 'watchUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Download Source URL</label>
                    <input
                      type="text"
                      value={q.downloadUrl}
                      onChange={(e) => updateQualityRow(idx, 'downloadUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Visibility Flags */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
            Publishing Status &amp; Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MovieStatus)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white"
              >
                <option value="published">Published (Visible to all)</option>
                <option value="draft">Draft (Admin only)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white"
              >
                <option value="movie">Full Feature Movie</option>
                <option value="web-series">Web Series / Episodic</option>
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
                <span>Featured Section</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-white cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  className="rounded text-red-600 focus:ring-0 bg-neutral-800"
                />
                <span>Trending Badge</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
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
            {saving ? 'Creating Movie...' : 'Save & Publish Movie'}
          </button>
        </div>

      </form>
    </div>
  );
};
