import React, { useState } from 'react';
import { useMovies } from '../context/MoviesContext';
import { HeroSection } from '../components/HeroSection';
import { MovieRow } from '../components/MovieRow';
import { TrailerModal } from '../components/TrailerModal';
import { HeroSkeleton, GridSkeleton } from '../components/LoadingSkeleton';
import { AdBanner } from '../components/ads/AdBanner';
import { Movie } from '../types';

export const HomePage: React.FC = () => {
  const { movies, loading } = useMovies();
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  if (loading) {
    return (
      <div className="space-y-8 pb-16">
        <HeroSkeleton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-6 w-48 bg-neutral-800 rounded" />
          <GridSkeleton count={6} />
        </div>
      </div>
    );
  }

  // Filter specific sections
  const heroMovie = movies.find(m => m.featured && m.backdropUrl) || movies[0];
  const featuredMovies = movies.filter(m => m.featured);
  const latestMovies = [...movies].sort((a, b) => b.releaseYear - a.releaseYear);
  const trendingMovies = movies.filter(m => m.trending);
  const banglaMovies = movies.filter(m => m.language === 'Bangla');
  const hindiMovies = movies.filter(m => m.language === 'Hindi');
  const englishMovies = movies.filter(m => m.language === 'English');
  const southIndianMovies = movies.filter(m => ['Tamil', 'Telugu', 'Malayalam', 'Kannada'].includes(m.language));
  const webSeries = movies.filter(m => m.type === 'web-series');
  const popularMovies = [...movies].sort((a, b) => (b.views || 0) - (a.views || 0));

  return (
    <div className="pb-16 bg-[#080808]">
      {/* Hero Section */}
      {heroMovie && (
        <HeroSection
          movie={heroMovie}
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />
      )}

      {/* Placement: homepage_top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner placement="homepage_top" />
      </div>

      {/* 9 Requested Movie Sections */}
      <div className="space-y-2 mt-2">
        {/* 1. Featured Movies */}
        <MovieRow
          title="Featured Movies"
          movies={featuredMovies}
          viewAllLink="/movies?featured=true"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* 2. Latest Movies */}
        <MovieRow
          title="Latest Movies"
          movies={latestMovies}
          viewAllLink="/movies?sort=latest"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* 3. Trending Movies */}
        <MovieRow
          title="Trending Movies"
          movies={trendingMovies}
          viewAllLink="/movies?trending=true"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* 4. Bangla Movies */}
        <MovieRow
          title="Bangla Movies"
          movies={banglaMovies}
          viewAllLink="/category/bangla"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* Placement: homepage_between */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <AdBanner placement="homepage_between" />
        </div>

        {/* 5. Hindi Movies */}
        <MovieRow
          title="Hindi Movies"
          movies={hindiMovies}
          viewAllLink="/category/hindi"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* 6. English Movies */}
        <MovieRow
          title="English Movies"
          movies={englishMovies}
          viewAllLink="/category/english"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* 7. South Indian Movies */}
        <MovieRow
          title="South Indian Movies"
          movies={southIndianMovies}
          viewAllLink="/category/south-indian"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* 8. Web Series */}
        <MovieRow
          title="Web Series"
          movies={webSeries}
          viewAllLink="/category/web-series"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />

        {/* 9. Popular Movies */}
        <MovieRow
          title="Popular Movies"
          movies={popularMovies}
          viewAllLink="/movies?sort=views"
          onPlayTrailer={(m) => setActiveTrailerMovie(m)}
        />
      </div>

      {/* Placement: homepage_bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner placement="homepage_bottom" />
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
