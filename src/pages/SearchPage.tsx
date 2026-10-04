import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Film, ArrowRight } from 'lucide-react';
import { useMovies } from '../context/MoviesContext';
import { MovieGrid } from '../components/MovieGrid';
import { TrailerModal } from '../components/TrailerModal';
import { Movie } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const { movies, loading } = useMovies();
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  useEffect(() => {
    setSearchTerm(queryParam);
    if (queryParam) {
      document.title = `Search: "${queryParam}" | MovieHub BD`;
    }
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return movies.filter((m) => {
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchGenre = m.genres.some((g) => g.toLowerCase().includes(q));
      const matchLang = m.language.toLowerCase().includes(q);
      const matchYear = m.releaseYear.toString().includes(q);
      const matchDirector = m.director.toLowerCase().includes(q);
      const matchCast = m.cast.some((c) => c.toLowerCase().includes(q));
      return (
        matchTitle ||
        matchGenre ||
        matchLang ||
        matchYear ||
        matchDirector ||
        matchCast
      );
    });
  }, [movies, searchTerm]);

  return (
    <div className="bg-[#080808] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Header Form */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Find Movies &amp; Series
          </h1>
          <p className="text-neutral-400 text-sm">
            Search by movie title, actor, director, genre, language, or release year.
          </p>

          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search e.g. Dhaka Noir, Joya Ahsan, Action, 2026..."
              className="w-full bg-[#171717] border border-neutral-700/80 rounded-2xl pl-12 pr-28 py-3.5 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition-colors shadow-2xl"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium text-sm transition-all shadow-md"
            >
              Search
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-neutral-400">
            <span>Popular searches:</span>
            {['Dhaka Noir', 'Bangla Thriller', 'South Indian', 'Denis Villeneuve', '2026'].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setSearchTerm(chip);
                  setSearchParams({ q: chip });
                }}
                className="hover:text-white underline underline-offset-4 decoration-neutral-700"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Display */}
        {searchTerm.trim() ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Results for &ldquo;<span className="text-red-500">{searchTerm}</span>&rdquo;
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {results.length} titles found
              </span>
            </div>

            <MovieGrid
              movies={results}
              onPlayTrailer={(m) => setActiveTrailerMovie(m)}
              emptyMessage={`No titles found matching "${searchTerm}". Try checking for spelling errors or searching by broad genres like "Action" or "Bangla".`}
            />
          </div>
        ) : (
          <div className="py-16 text-center text-neutral-500">
            <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Type a search query above to explore our movie database.</p>
          </div>
        )}

      </div>

      <TrailerModal
        movie={activeTrailerMovie}
        isOpen={Boolean(activeTrailerMovie)}
        onClose={() => setActiveTrailerMovie(null)}
      />
    </div>
  );
};
