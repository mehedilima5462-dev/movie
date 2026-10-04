import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  FolderTree,
  Users,
  Settings,
  ArrowLeft,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  Megaphone,
  UploadCloud
} from 'lucide-react';


import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, toggleAdminDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141414] border border-neutral-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-950/50 border border-red-800 flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Access Restricted</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            You are logged in as a standard user ({user?.email || 'Guest'}). Only accounts with administrator privileges can access the MovieHub BD Management Console.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={toggleAdminDemoRole}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Elevate Current Session to Admin
            </button>
            <Link
              to="/"
              className="w-full py-2 px-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Movie Upload Studio', path: '/admin/upload', icon: UploadCloud },
    { label: 'All Movies', path: '/admin/movies', icon: Film, exact: true },
    { label: 'Add Movie Form', path: '/admin/movies/add', icon: PlusCircle },
    { label: 'Ads Manager', path: '/admin/ads', icon: Megaphone },
    { label: 'Categories & Genres', path: '/admin/categories', icon: FolderTree },
    { label: 'Users & Roles', path: '/admin/users', icon: Users },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];



  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 flex flex-col lg:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#121212] border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white bg-neutral-900"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-white font-display">MovieHub Admin</span>
        </div>
        <Link to="/" className="text-xs text-red-500 hover:text-red-400 font-semibold">
          Exit to Site &rarr;
        </Link>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111111] border-r border-neutral-800/80 p-5 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Admin Wordmark */}
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white">
                M
              </div>
              <div>
                <span className="text-base font-extrabold text-white font-display block leading-tight">
                  MovieHub <span className="text-red-500">BD</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-950/40'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-3">
          <div className="px-3 py-2 bg-neutral-900/80 rounded-xl border border-neutral-800 text-xs">
            <span className="text-neutral-500 block">Logged in as:</span>
            <span className="text-white font-medium truncate block">
              {user?.displayName || user?.email}
            </span>
            <span className="text-amber-400 text-[10px] uppercase font-bold tracking-wider">
              Administrator
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Site
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
