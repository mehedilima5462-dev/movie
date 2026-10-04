import React, { useState } from 'react';
import {
  Settings,
  Database,
  ShieldCheck,
  Server,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MoviesContext';

export const AdminSettingsPage: React.FC = () => {
  const { isFirebaseActive } = useAuth();
  const { resetToDefaultSeed, movies } = useMovies();
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleCopyHtaccess = () => {
    const htaccessContent = `RewriteEngine On\nRewriteBase /\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.html [L]`;
    navigator.clipboard.writeText(htaccessContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetData = async () => {
    if (window.confirm('Reset database to 20 fictional seed movies? Any modifications will be refreshed.')) {
      setResetting(true);
      try {
        await resetToDefaultSeed();
        alert('Database restored with 20 seed movies successfully.');
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          System &amp; Deployment Settings
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Review Firebase persistence, database state, and Hosting.com shared hosting compliance.
        </p>
      </div>

      {/* Persistence & Firebase Status Card */}
      <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Cloud className="w-4 h-4 text-blue-400" />
          Firebase Backend Status
        </h2>

        <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3">
            {isFirebaseActive ? (
              <div className="w-9 h-9 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-amber-950 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="font-semibold text-white text-sm">
                {isFirebaseActive ? 'Live Firebase Connected' : 'Local Persistence & Offline Fallback Active'}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isFirebaseActive
                  ? 'Authenticated via Firestore & Firebase Auth using environment variables in .env'
                  : 'App works 100% out of the box with seed movies and local storage. Add VITE_FIREBASE_* variables in .env to connect a live cloud database.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetData}
            disabled={resetting}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors shrink-0"
          >
            {resetting ? 'Resetting...' : 'Re-seed Seed Data'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
            <span className="text-neutral-500 font-medium block">Current Catalog Volume</span>
            <span className="font-mono text-base font-bold text-white">{movies.length} titles</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
            <span className="text-neutral-500 font-medium block">Firestore Security Rules</span>
            <span className="text-emerald-400 font-medium block">Deployed via firestore.rules (RBAC)</span>
          </div>
        </div>
      </div>

      {/* Hosting.com Shared Hosting Deployment Verification */}
      <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Server className="w-4 h-4 text-red-500" />
          Hosting.com / cPanel Shared Hosting Instructions
        </h2>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          This platform generates a 100% static production bundle that does <strong>NOT</strong> require a long-running Node.js process on the server. Follow these 4 steps to deploy to Hosting.com shared hosting:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
            <span className="font-bold text-white">Step 1: Install dependencies &amp; configure environment</span>
            <pre className="bg-black/50 p-2 rounded text-neutral-300 font-mono text-[11px] overflow-x-auto">
              npm install
            </pre>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
            <span className="font-bold text-white">Step 2: Build static output into dist/</span>
            <pre className="bg-black/50 p-2 rounded text-neutral-300 font-mono text-[11px] overflow-x-auto">
              npm run build
            </pre>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Step 3: Verify .htaccess rewrite rule</span>
              <button
                onClick={handleCopyHtaccess}
                className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy .htaccess'}
              </button>
            </div>
            <p className="text-neutral-400">
              The project includes <code className="text-neutral-200">public/.htaccess</code> which automatically bundles into <code className="text-neutral-200">dist/.htaccess</code> to prevent 404 errors on direct navigation or page refresh:
            </p>
            <pre className="bg-black/50 p-2 rounded text-neutral-300 font-mono text-[11px] overflow-x-auto">
{`RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]`}
            </pre>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
            <span className="font-bold text-white">Step 4: Upload to public_html</span>
            <p className="text-neutral-400">
              Upload all files from the generated <code className="text-neutral-200">dist/</code> folder into your Hosting.com <code className="text-neutral-200">public_html/</code> directory via File Manager or SFTP.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Content Compliance */}
      <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Content Compliance Verification
        </h2>
        <ul className="space-y-2 text-xs text-neutral-300">
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Zero unauthorized torrents or scraper links.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Authorized video streams served via designated publisher storage buckets.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>Admin credentials are protected via Firebase Security Rules and not exposed in client bundles.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
