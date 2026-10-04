import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0b0b] border-t border-neutral-800/80 pt-14 pb-10 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-display">
                MovieHub <span className="text-red-500">BD</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
              MovieHub BD is a premier entertainment discovery and authorized streaming catalog dedicated to showcasing cinema from Bangladesh, India, and global creators. We support licensed publishers, creators, and public-domain works.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/80 p-3 rounded-lg border border-neutral-800/60 max-w-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict compliance with authorized digital distribution policies. No unauthorized piracy or torrenting.</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Browse Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/category/bangla" className="hover:text-white transition-colors">
                  Bangla Cinema
                </Link>
              </li>
              <li>
                <Link to="/category/hindi" className="hover:text-white transition-colors">
                  Hindi Blockbusters
                </Link>
              </li>
              <li>
                <Link to="/category/english" className="hover:text-white transition-colors">
                  Hollywood &amp; International
                </Link>
              </li>
              <li>
                <Link to="/category/south-indian" className="hover:text-white transition-colors">
                  South Indian Cinema
                </Link>
              </li>
              <li>
                <Link to="/category/web-series" className="hover:text-white transition-colors">
                  Original Web Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Legal &amp; Policy
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About MovieHub BD
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="hover:text-white transition-colors">
                  DMCA &amp; Copyright Policy
                </Link>
              </li>
              <li className="pt-2 border-t border-neutral-800/80">
                <Link to="/admin" className="text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span>Admin Console</span>
                  <span className="text-[10px] bg-red-950/80 border border-red-800 text-red-300 px-1.5 py-0.2 rounded">Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/upload" className="text-neutral-400 hover:text-white transition-colors text-xs">
                  Movie Upload Studio
                </Link>
              </li>
              <li>
                <Link to="/admin/ads" className="text-neutral-400 hover:text-white transition-colors text-xs">
                  Ads Manager
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-neutral-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            &copy; {new Date().getFullYear()} MovieHub BD. All rights reserved. Video streams are served via authorized sources.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/dmca" className="hover:text-neutral-300 transition-colors">
              DMCA Notice
            </Link>
            <span>·</span>
            <Link to="/privacy-policy" className="hover:text-neutral-300 transition-colors">
              Cookies &amp; Privacy
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-neutral-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
