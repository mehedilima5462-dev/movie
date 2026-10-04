import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-[#080808] min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-red-950/40 border border-red-900/60 flex items-center justify-center mx-auto text-red-500 shadow-2xl">
          <Film className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-200">
            Page Not Found
          </h2>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            The reel you are looking for has either been moved, deleted, or never existed in the MovieHub BD archive.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-red-950/40 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/movies"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs sm:text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
};
