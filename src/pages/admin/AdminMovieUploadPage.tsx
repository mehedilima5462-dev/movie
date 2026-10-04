import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Play,
  Layers,
  FileCode,
  HardDrive
} from 'lucide-react';
import { useMovies } from '../../context/MoviesContext';
import { MovieQuality, VideoQuality, MovieStatus, ContentType, Movie } from '../../types';
import { GENRES_LIST, LANGUAGES_LIST } from '../../data/seedMovies';

export const AdminMovieUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addMovie } = useMovies();

  // Tab: 'single' (File & Media Uploader) vs 'bulk' (JSON / CSV Bulk Import)
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Video File Upload State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoFileSize, setVideoFileSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  // Poster & Backdrop Files
  const [posterPreview, setPosterPreview] = useState<string>('/src/assets/images/poster_dhaka_detective_1791033544494.jpg');
  const [backdropPreview, setBackdropPreview] = useState<string>('/src/assets/images/hero_dhaka_noir_1791033530244.jpg');

  // Metadata Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [releaseYear, setReleaseYear] = useState<number>(2026);
  const [language, setLanguage] = useState('Bangla');
  const [country, setCountry] = useState('Bangladesh');
  const [duration, setDuration] = useState('2h 15m');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [rating, setRating] = useState<number>(8.5);
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'Thriller']);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(true);
  const [status, setStatus] = useState<MovieStatus>('published');
  const [type, setType] = useState<ContentType>('movie');
  const [trailerUrl, setTrailerUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');

  // Multi-quality generated streams
  const [generatedQualities, setGeneratedQualities] = useState<MovieQuality[]>([
    {
      quality: '480P',
      fileSize: '450 MB',
      watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      authorized: true,
      format: 'MP4'
    },
    {
      quality: '720P',
      fileSize: '980 MB',
      watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      authorized: true,
      format: 'MP4'
    },
    {
      quality: '1080P',
      fileSize: '2.1 GB',
      watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      authorized: true,
      format: 'MP4'
    },
    {
      quality: '4K',
      fileSize: '5.6 GB',
      watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      authorized: true,
      format: 'MKV'
    }
  ]);

  // Bulk JSON import state
  const [bulkJsonText, setBulkJsonText] = useState('');
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);

  // File input refs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);

  // Handle Video File Selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
      const formattedSize = file.size > 1024 * 1024 * 1024 ? `${sizeGB} GB` : `${sizeMB} MB`;
      setVideoFileSize(formattedSize);

      // Auto-extract title from file name (e.g. "Dhaka_Noir_2026.1080p.mkv" -> "Dhaka Noir 2026")
      if (!title) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[._-]/g, ' ')
          .replace(/1080p|720p|4k|bluray|x264|x265|aac/gi, '')
          .trim();
        handleTitleChange(cleanName);
      }

      // Simulate upload process
      simulateUpload(formattedSize);
    }
  };

  const simulateUpload = (sizeStr: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadCompleted(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        setUploadCompleted(true);

        // Adjust qualities file sizes based on uploaded file
        setGeneratedQualities([
          {
            quality: '480P',
            fileSize: '420 MB',
            watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            authorized: true,
            format: 'MP4'
          },
          {
            quality: '720P',
            fileSize: '890 MB',
            watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            authorized: true,
            format: 'MP4'
          },
          {
            quality: '1080P',
            fileSize: sizeStr,
            watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            authorized: true,
            format: 'MP4'
          },
          {
            quality: '4K',
            fileSize: '5.8 GB',
            watchUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            authorized: true,
            format: 'MKV'
          }
        ]);
      } else {
        setUploadProgress(current);
      }
    }, 200);
  };

  // Handle Poster Image Upload
  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPosterPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Backdrop Image Upload
  const handleBackdropSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackdropPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Preset Poster Chooser
  const handlePresetSelect = (num: number) => {
    if (num === 1) {
      setPosterPreview('/src/assets/images/poster_dhaka_detective_1791033544494.jpg');
      setBackdropPreview('/src/assets/images/hero_dhaka_noir_1791033530244.jpg');
    } else if (num === 2) {
      setPosterPreview('/src/assets/images/poster_monsoon_rhythm_1791033555846.jpg');
      setBackdropPreview('/src/assets/images/poster_monsoon_rhythm_1791033555846.jpg');
    } else {
      setPosterPreview('/src/assets/images/poster_bengal_expedition_1791033567269.jpg');
      setBackdropPreview('/src/assets/images/poster_bengal_expedition_1791033567269.jpg');
    }
  };

  // Publish Movie
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert('Please provide at least Movie Title and Slug identifier.');
      return;
    }

    const castList = cast
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    await addMovie({
      title,
      slug,
      posterUrl: posterPreview,
      backdropUrl: backdropPreview,
      trailerUrl: trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      description: description || 'Authorized high-definition feature streaming on MovieHub BD.',
      releaseYear: Number(releaseYear),
      language,
      country,
      duration,
      genres: selectedGenres.length > 0 ? selectedGenres : ['Action'],
      director: director || 'Director Name',
      cast: castList.length > 0 ? castList : ['Lead Actor', 'Supporting Actor'],
      rating: Number(rating),
      featured,
      trending,
      status,
      type,
      qualities: generatedQualities
    });

    navigate('/admin/movies');
  };

  // Bulk JSON Import
  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkJsonText);
      const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        await addMovie({
          title: item.title || 'Untitled Movie',
          slug: item.slug || `movie-${Date.now()}`,
          posterUrl: item.posterUrl || '/src/assets/images/poster_dhaka_detective_1791033544494.jpg',
          backdropUrl: item.backdropUrl || '/src/assets/images/hero_dhaka_noir_1791033530244.jpg',
          trailerUrl: item.trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          description: item.description || '',
          releaseYear: Number(item.releaseYear) || 2026,
          language: item.language || 'Bangla',
          country: item.country || 'Bangladesh',
          duration: item.duration || '2h 00m',
          genres: item.genres || ['Action'],
          director: item.director || 'Director',
          cast: item.cast || ['Actor 1'],
          rating: Number(item.rating) || 8.0,
          featured: Boolean(item.featured),
          trending: Boolean(item.trending),
          status: 'published',
          type: 'movie',
          qualities: generatedQualities
        });
      }

      setBulkStatus(`Successfully imported ${items.length} titles into catalog!`);
      setTimeout(() => navigate('/admin/movies'), 1500);
    } catch (err: any) {
      setBulkStatus('JSON Parse Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-800/40">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Movie Upload Studio
            </h1>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            Drag-and-drop master video files, upload high-res posters, transcode multi-resolution streams, and publish to catalog.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'single'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileVideo className="w-3.5 h-3.5" />
            Media File Uploader
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'bulk'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Bulk JSON Importer
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <form onSubmit={handlePublish} className="space-y-8">
          
          {/* STEP 1: VIDEO MASTER UPLOAD DROPZONE */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FileVideo className="w-4 h-4 text-red-500" />
                <span>1. Master Video Stream Upload</span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                Supports MP4, MKV, WebM (Up to 15 GB)
              </span>
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoSelect}
            />

            {/* Dropzone Container */}
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-800 hover:border-red-600/60 rounded-2xl p-8 text-center bg-neutral-900/40 hover:bg-neutral-900/70 transition-all cursor-pointer group space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-800 group-hover:bg-red-600/20 text-neutral-400 group-hover:text-red-500 flex items-center justify-center mx-auto transition-colors">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {videoFileName ? `Selected: ${videoFileName}` : 'Drag & drop master video file, or browse files'}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {videoFileSize
                    ? `File size: ${videoFileSize} · Automated bitrate analysis ready`
                    : 'System automatically generates 480P, 720P, 1080P, and 4K stream presets'}
                </p>
              </div>
            </div>

            {/* Animated Progress Bar */}
            {isUploading && (
              <div className="space-y-2 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-300">
                  <span className="font-semibold flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-red-500 animate-pulse" />
                    Uploading &amp; Analyzing Stream Bitrates ({uploadProgress}%)
                  </span>
                  <span className="font-mono text-neutral-400">28.4 MB/s · 00:04 remaining</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadCompleted && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Video master stream successfully ingested ({videoFileName}, {videoFileSize}). 4 multi-resolution stream endpoints configured.
                </span>
              </div>
            )}
          </div>

          {/* STEP 2: POSTER & BACKDROP UPLOAD */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>2. Poster &amp; Backdrop Media Artwork</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500">Fast Preset:</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(1)}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  Detective
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(2)}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  Monsoon
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(3)}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  Expedition
                </button>
              </div>
            </div>

            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePosterSelect}
            />
            <input
              ref={backdropInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackdropSelect}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Poster Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Movie Poster (2:3 Portrait Aspect Ratio)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-36 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0 relative group">
                    <img
                      src={posterPreview}
                      alt="Poster Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      onClick={() => posterInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white cursor-pointer transition-opacity"
                    >
                      Change
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => posterInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Browse Poster File
                    </button>
                    <p className="text-neutral-500">
                      Recommended resolution: 600×900px JPG or WebP
                    </p>
                  </div>
                </div>
              </div>

              {/* Backdrop Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Hero Backdrop (16:9 Landscape Aspect Ratio)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-40 h-24 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0 relative group">
                    <img
                      src={backdropPreview}
                      alt="Backdrop Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      onClick={() => backdropInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white cursor-pointer transition-opacity"
                    >
                      Change
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => backdropInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Browse Backdrop File
                    </button>
                    <p className="text-neutral-500">
                      Recommended resolution: 1920×1080px JPG or WebP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: MOVIE METADATA & INFORMATION */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Film className="w-4 h-4 text-red-500" />
              <span>3. Movie Title &amp; Catalog Details</span>
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
                  className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
                  className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
                  className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
                  className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
                  placeholder="e.g. Arifin Shuvoo, Joya Ahsan"
                  className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Synopsis / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Synopsis of the movie..."
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>

            {/* Genres Selector */}
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

          {/* STEP 4: MULTI-RESOLUTION GENERATED QUALITIES */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>4. Generated Streaming Qualities (480P, 720P, 1080P, 4K)</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Transcoded bitrates and download sources mapped from your master video stream.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {generatedQualities.map((q) => (
                <div
                  key={q.quality}
                  className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-500 uppercase tracking-wider">
                      {q.quality} Stream
                    </span>
                    <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {q.fileSize}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-[11px] truncate font-mono">
                    Format: {q.format || 'MP4'}
                  </p>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    ✓ Verified Authorized Source
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publishing Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <Link
              to="/admin/movies"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Ingest &amp; Publish Movie
            </button>
          </div>

        </form>
      ) : (
        /* BULK JSON IMPORTER TAB */
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Bulk JSON Movie Importer</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Paste an array of movie documents in JSON format to ingest multiple titles simultaneously into Firestore / Local database.
            </p>
          </div>

          {bulkStatus && (
            <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-emerald-400">
              {bulkStatus}
            </div>
          )}

          <textarea
            rows={10}
            value={bulkJsonText}
            onChange={(e) => setBulkJsonText(e.target.value)}
            placeholder={`[
  {
    "title": "Dhaka Noir: Crimson Rain",
    "slug": "dhaka-noir-crimson-rain",
    "releaseYear": 2026,
    "language": "Bangla",
    "genres": ["Thriller", "Crime"],
    "rating": 8.8,
    "director": "Tanvir Hasan",
    "description": "In the rain-drenched alleys of Old Dhaka..."
  }
]`}
            className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-red-600"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setBulkJsonText(JSON.stringify([
                  {
                    title: "Dhaka Cyberpunk 2045",
                    slug: "dhaka-cyberpunk-2045",
                    releaseYear: 2026,
                    language: "Bangla",
                    genres: ["Sci-Fi", "Action"],
                    rating: 8.7,
                    director: "Mostofa Sarwar Farooki",
                    description: "High-tech futuristic mystery along the Buriganga river corridor."
                  }
                ], null, 2));
              }}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300"
            >
              Load Sample JSON
            </button>
            <button
              onClick={handleBulkImport}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md"
            >
              <UploadCloud className="w-4 h-4" />
              Execute Bulk Ingestion
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
