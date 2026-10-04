import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search } from 'lucide-react';
import { useMovies } from '../context/MoviesContext';
import { MovieGrid } from '../components/MovieGrid';
import { TrailerModal } from '../components/TrailerModal';
import { AdBanner } from '../components/ads/AdBanner';
import { GENRES_LIST, LANGUAGES_LIST, YEARS_LIST, QUALITIES_LIST } from '../data/seedMovies';
import { Movie } from '../types';

export const MoviesPage: React.FC = () => {
  const { movies, loading } = useMovies();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial params
  const initialLang = searchParams.get('lang') || 'all';
  const initialGenre = searchParams.get('genre') || 'all';
  const initialYear = searchParams.get('year') || 'all';
  const initialQuality = searchParams.get('quality') || 'all';
  const initialSort = searchParams.get('sort') || 'latest';
  const initialSearch = searchParams.get('q') || '';

  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedQuality, setSelectedQuality] = useState(initialQuality);
  const [sortBy, setSortBy] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((c) => c.toLowerCase().includes(q)) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (selectedLang !== 'all') {
      result = result.filter(
        (m) => m.language.toLowerCase() === selectedLang.toLowerCase()
      );
    }

    if (selectedGenre !== 'all') {
      result = result.filter((m) =>
        m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    if (selectedYear !== 'all') {
      result = result.filter((m) => m.releaseYear.toString() === selectedYear);
    }

    if (selectedQuality !== 'all') {
      result = result.filter((m) =>
        m.qualities?.some((q) => q.quality === selectedQuality)
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'views':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'latest':
      default:
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
    }

    return result;
  }, [movies, searchQuery, selectedLang, selectedGenre, selectedYear, selectedQuality, sortBy]);

  const handleResetFilters = () => {
    setSelectedLang('all');
    setSelectedGenre('all');
    setSelectedYear('all');
    setSelectedQuality('all');
    setSortBy('latest');
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedLang !== 'all' ||
    selectedGenre !== 'all' ||
    selectedYear !== 'all' ||
    selectedQuality !== 'all' ||
    Boolean(searchQuery);

  return (
    <div className="bg-[#080808] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Movie Catalog &amp; Filter
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Browse {filteredMovies.length} authorized titles filtered by language, genre, year, and quality.
            </p>
          </div>

          {/* Quick Search in Filter Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in catalog..."
              className="w-full bg-[#171717] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#121212] p-4 sm:p-5 rounded-2xl border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <SlidersHorizontal className="w-4 h-4 text-red-500" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Language Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Language
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="all">All Languages</option>
                {LANGUAGES_LIST.map((l) => (
                  <option key={l} value={l.toLowerCase()}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="all">All Genres</option>
                {GENRES_LIST.map((g) => (
                  <option key={g} value={g.toLowerCase()}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Release Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="all">All Years</option>
                {YEARS_LIST.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Quality Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Quality
              </label>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="all">All Qualities</option>
                {QUALITIES_LIST.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="latest">Latest Releases</option>
                <option value="rating">Highest Rated</option>
                <option value="views">Most Viewed</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Placement: category_top */}
        <AdBanner placement="category_top" />

        {/* Results Grid */}
        <MovieGrid
          movies={filteredMovies}
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
          emptyMessage="No titles match the selected combination of filters. Try resetting filters."
        />

      </div>

      {/* Trailer Modal */}
      <TrailerModal
        movie={activeTrailerMovie}
        isOpen={Boolean(activeTrailerMovie)}
        onClose={() => setActiveTrailerMovie(null)}
      />
    </div>
  );
};
