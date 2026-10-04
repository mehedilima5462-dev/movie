import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Search,
  User,
  Heart,
  Clock,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MoviesContext';

export const Header: React.FC = () => {
  const { user, isAdmin, logout, toggleAdminDemoRole } = useAuth();
  const { movies } = useMovies();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<typeof movies>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search suggestion filter
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matched = movies
        .filter(
          m =>
            m.title.toLowerCase().includes(q) ||
            m.language.toLowerCase().includes(q) ||
            m.genres.some(g => g.toLowerCase().includes(q)) ||
            m.cast.some(c => c.toLowerCase().includes(q))
        )
        .slice(0, 5);
      setSearchSuggestions(matched);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, movies]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Bangla', path: '/category/bangla' },
    { label: 'Hindi', path: '/category/hindi' },
    { label: 'English', path: '/category/english' },
    { label: 'South Indian', path: '/category/south-indian' },
    { label: 'Web Series', path: '/category/web-series' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo - Top Bar Contract: Single text wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            aria-label="MovieHub BD Home"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white group-hover:text-red-500 transition-colors font-display">
              MovieHub <span className="text-red-600">BD</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-white bg-neutral-900 font-semibold text-red-500'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Admin Access */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:border-red-600/60 text-xs font-semibold text-neutral-300 hover:text-white transition-all shadow-sm"
              title="Admin Panel: Manage Ads, Movies & Uploads"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </Link>

            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-[#171717] border border-neutral-700 rounded-lg overflow-hidden w-64 sm:w-80 shadow-xl"
                >
                  <Search className="w-4 h-4 ml-3 text-neutral-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, actors, genre..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Open Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Live Search Suggestions Dropdown */}
              {searchOpen && searchSuggestions.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#171717] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                    Quick Matches
                  </div>
                  {searchSuggestions.map((m) => (
                    <Link
                      key={m.id}
                      to={`/movie/${m.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2.5 hover:bg-neutral-800 transition-colors border-b border-neutral-800/40 last:border-0"
                    >
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-10 h-14 object-cover rounded bg-neutral-900 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">{m.title}</div>
                        <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                          <span>{m.releaseYear}</span>
                          <span>·</span>
                          <span>{m.language}</span>
                          <span>·</span>
                          <span className="text-amber-400">★ {m.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full text-center py-2 text-xs text-red-400 hover:text-red-300 bg-neutral-900 font-medium"
                  >
                    View all matching results →
                  </button>
                </div>
              )}
            </div>

            {/* Profile / Auth Button */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs text-white uppercase">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline-block max-w-[100px] truncate text-white font-medium">
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:inline" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#171717] border border-neutral-800 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-800">
                      <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                        <span className="capitalize">{user.role} Account</span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      My Profile
                    </Link>

                    <Link
                      to="/favorites"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      Favorites
                    </Link>

                    <Link
                      to="/profile#history"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-amber-500" />
                      Watch History
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-neutral-800/80 transition-colors border-t border-neutral-800/60"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-neutral-800/80 my-1 pt-1">
                      <button
                        onClick={toggleAdminDemoRole}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                        title="Toggle admin role for testing"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        Role: {isAdmin ? 'Switch to Regular' : 'Switch to Admin Demo'}
                      </button>

                      <button
                        onClick={() => logout()}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-neutral-800/80 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg transition-all shadow-md shadow-red-950/40"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0f0f0f] border-b border-neutral-800 shadow-2xl p-4 max-h-[calc(100vh-4rem)] overflow-y-auto z-40">
          <div className="space-y-1 pb-4 border-b border-neutral-800">
            {/* Quick Admin Panel link */}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-base font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-red-500 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>Admin Panel (Ads &amp; Uploads)</span>
            </Link>

            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-base font-medium rounded-lg text-neutral-200 hover:bg-neutral-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white"
                >
                  <User className="w-4 h-4" />
                  My Profile ({user.displayName || user.email})
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  Favorites
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-amber-400 font-semibold"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={toggleAdminDemoRole}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-neutral-400"
                >
                  <Sparkles className="w-3 h-3 text-red-400" />
                  Toggle Admin Demo: {isAdmin ? 'Currently Admin' : 'Currently User'}
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2.5 rounded-lg bg-neutral-800 text-neutral-200 font-medium text-sm hover:bg-neutral-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
