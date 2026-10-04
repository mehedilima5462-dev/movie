import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Play,
  Heart,
  Download,
  ShieldCheck,
  Calendar,
  Clock,
  Globe,
  Film,
  User,
  ArrowLeft
} from 'lucide-react';
import { useMovies } from '../context/MoviesContext';
import { useAuth } from '../context/AuthContext';
import { VideoQuality, Movie } from '../types';
import { TrailerModal } from '../components/TrailerModal';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { MovieRow } from '../components/MovieRow';
import { AdBanner } from '../components/ads/AdBanner';
import { NativeAd } from '../components/ads/NativeAd';
import { InterstitialAd } from '../components/ads/InterstitialAd';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMovieByIdOrSlug, isFavorite, toggleFav, movies, incrementViews } = useMovies();
  const { user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('1080P');
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getMovieByIdOrSlug(id);
      if (found) {
        setMovie(found);
        incrementViews(found.id);
        // Dynamic SEO title
        document.title = `${found.title} (${found.releaseYear}) - Watch & Download | MovieHub BD`;
      }
    }
  }, [id, movies]);

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Film className="w-16 h-16 text-neutral-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-neutral-400 mb-6 max-w-md">
          The requested title might have been archived or the URL has changed.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(movie.id);

  const handleFavorite = async () => {
    if (!user) {
      alert('Please log in to add this movie to your favorites.');
      return;
    }
    setFavLoading(true);
    try {
      await toggleFav(movie);
    } finally {
      setFavLoading(false);
    }
  };

  const handleWatchQuality = (quality: VideoQuality) => {
    setSelectedQuality(quality);
    setInterstitialOpen(true);
  };

  const handleProceedToStream = () => {
    setInterstitialOpen(false);
    setPlayerModalOpen(true);
  };

  // Related movies (same genre or language, excluding this movie)
  const relatedMovies = movies
    .filter(
      (m) =>
        m.id !== movie.id &&
        (m.language === movie.language || m.genres.some((g) => movie.genres.includes(g)))
    )
    .slice(0, 8);

  return (
    <div className="bg-[#080808] min-h-screen pb-16">
      {/* Backdrop Hero Banner */}
      <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[520px] overflow-hidden">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover filter brightness-50"
        />
        {/* Scrim overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/60 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <Link
            to="/movies"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-xs font-medium backdrop-blur-md border border-neutral-700/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Movies</span>
          </Link>
        </div>
      </div>

      {/* Main Details Container (Elevated Over Backdrop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 sm:-mt-52 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Poster & Quick Triggers */}
          <div className="lg:col-span-4 max-w-[320px] mx-auto lg:mx-0 w-full space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 aspect-[2/3] relative">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              {/* Quality overlay */}
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-lg">
                Ultra HD
              </div>
            </div>

            {/* Trailer & Favorite actions */}
            <div className="grid grid-cols-2 gap-3">
              {movie.trailerUrl && (
                <button
                  onClick={() => setTrailerModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Trailer
                </button>
              )}

              <button
                onClick={handleFavorite}
                disabled={favLoading}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                  favorited
                    ? 'bg-red-950/40 border-red-600 text-red-400'
                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-neutral-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-red-500' : ''}`} />
                {favorited ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          </div>

          {/* Right Column: Metadata, Description & Qualities */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Fast Stats */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-neutral-400 mb-2">
                <span className="flex items-center gap-1 text-amber-400 font-bold text-sm tabular-nums">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.rating.toFixed(1)} / 10
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {movie.releaseYear}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {movie.duration}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <Globe className="w-3.5 h-3.5" />
                  {movie.language} ({movie.country})
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
                {movie.title}
              </h1>

              {/* Genres list - unboxed */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-neutral-300">
                {movie.genres.map((g, idx) => (
                  <React.Fragment key={g}>
                    <Link
                      to={`/genre/${g.toLowerCase()}`}
                      className="hover:text-red-400 transition-colors"
                    >
                      {g}
                    </Link>
                    {idx < movie.genres.length - 1 && <span className="text-neutral-600">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Synopsis / Description */}
            <div className="bg-[#171717] rounded-xl p-5 border border-neutral-800/80 space-y-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Synopsis
              </h3>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Crew / Cast Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#171717] rounded-xl p-5 border border-neutral-800/80 text-sm">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                  Director
                </span>
                <div className="flex items-center gap-2 text-white font-medium">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span>{movie.director}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                  Starring Cast
                </span>
                <p className="text-neutral-200">
                  {movie.cast.join(', ')}
                </p>
              </div>
            </div>

            {/* Placement: details_below_info */}
            <NativeAd placement="details_below_info" />

            {/* Placement: details_before_watch */}
            <AdBanner placement="details_before_watch" />

            {/* Authorized Quality Section (480P, 720P, 1080P, 4K) */}
            <div className="bg-[#171717] rounded-xl p-5 border border-neutral-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Authorized Streaming &amp; Downloads
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Select your preferred resolution for authorized playback or offline caching.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
                  <ShieldCheck className="w-4 h-4" /> Verified Media
                </div>
              </div>

              {/* Qualities Table / Cards */}
              <div className="space-y-3">
                {movie.qualities && movie.qualities.length > 0 ? (
                  movie.qualities.map((q) => (
                    <div
                      key={q.quality}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-red-600/90 text-white font-black text-xs tracking-wider">
                          {q.quality}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {movie.title} - {q.quality}
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center gap-2">
                            <span>Format: {q.format || 'MP4'}</span>
                            <span>·</span>
                            <span className="font-mono">{q.fileSize}</span>
                            <span>·</span>
                            <span className="text-emerald-400">Authorized Source</span>
                          </div>
                        </div>
                      </div>

                      {/* Authorized Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {q.watchUrl && (
                          <button
                            onClick={() => handleWatchQuality(q.quality)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-md transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Watch
                          </button>
                        )}

                        {q.downloadUrl && q.authorized && (
                          <a
                            href={q.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-medium text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-400">Stream qualities currently syncing.</p>
                )}
              </div>
            </div>

            {/* Placement: details_below_trailer */}
            <AdBanner placement="details_below_trailer" />
          </div>

        </div>


        {/* Related Titles Row */}
        {relatedMovies.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-800/80">
            <MovieRow
              title="Related Titles You May Like"
              movies={relatedMovies}
              onPlayTrailer={(m) => {
                setMovie(m);
                setTrailerModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Placement: details_bottom */}
        <AdBanner placement="details_bottom" className="mt-8" />
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        movie={movie}
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
      />

      {/* Watch Flow Interstitial Modal */}
      <InterstitialAd
        isOpen={interstitialOpen}
        movieTitle={movie.title}
        quality={selectedQuality}
        onContinue={handleProceedToStream}
        onClose={() => setInterstitialOpen(false)}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        movie={movie}
        initialQuality={selectedQuality}
        isOpen={playerModalOpen}
        onClose={() => setPlayerModalOpen(false)}
      />
    </div>
  );
};

