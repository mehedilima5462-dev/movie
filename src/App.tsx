import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MoviesProvider } from './context/MoviesContext';
import { AdsProvider } from './context/AdsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Pages
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Legal Pages
import { AboutPage } from './pages/legal/AboutPage';
import { ContactPage } from './pages/legal/ContactPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { DMCAPage } from './pages/legal/DMCAPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMoviesPage } from './pages/admin/AdminMoviesPage';
import { AdminMovieUploadPage } from './pages/admin/AdminMovieUploadPage';
import { AdminAddMoviePage } from './pages/admin/AdminAddMoviePage';
import { AdminEditMoviePage } from './pages/admin/AdminEditMoviePage';
import { AdminAdsPage } from './pages/admin/AdminAdsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';


// Public layout wrapper with Header & Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#080808] text-white">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MoviesProvider>
          <AdsProvider>
            <ScrollToTop />
            <Routes>
              {/* Public Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category/:category" element={<CategoryPage type="category" />} />
                <Route path="/genre/:genre" element={<CategoryPage type="genre" />} />
                <Route path="/year/:year" element={<CategoryPage type="year" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />

                {/* Legal & Compliance Routes */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/dmca" element={<DMCAPage />} />

                {/* 404 Catch-All inside public layout */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Management Section */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="upload" element={<AdminMovieUploadPage />} />
                <Route path="movies" element={<AdminMoviesPage />} />
                <Route path="movies/add" element={<AdminAddMoviePage />} />
                <Route path="movies/edit/:id" element={<AdminEditMoviePage />} />
                <Route path="ads" element={<AdminAdsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

            </Routes>
          </AdsProvider>
        </MoviesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

