import React from 'react';
import { Film, ShieldCheck, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#080808] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center mx-auto shadow-xl shadow-red-950/40">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            About MovieHub BD
          </h1>
          <p className="text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            The premier digital cinema destination honoring authentic Bangladeshi storytelling, South Asian blockbusters, and curated international masterpieces.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-[#141414] p-8 rounded-2xl border border-neutral-800 space-y-6 text-neutral-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-white">Our Mission</h2>
          <p>
            MovieHub BD was created to bridge movie lovers with high-quality, authorized cinematic experiences. We provide a sleek, fast, and responsive catalog where film enthusiasts can discover detailed metadata, verified resolution bitrates (480P, 720P, 1080P, 4K), trailers, and authorized streams.
          </p>
          <p>
            From the bustling neon streets of Dhaka to Kolkata heritage narratives, Mumbai thrillers, and South Indian epics, we celebrate diverse storytelling without compromising on digital copyright compliance or user experience.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-base font-bold text-white">100% Authorized</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We exclusively list content licensed by verified creators, studios, or public-domain archives.
            </p>
          </div>

          <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-base font-bold text-white">Curated Quality</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Multi-resolution bitrates with transparent file sizes and crystal-clear audio specifications.
            </p>
          </div>

          <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-2">
            <Heart className="w-6 h-6 text-red-500" />
            <h3 className="text-base font-bold text-white">Community Driven</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Personalized watchlists, favorites, and responsive playback across mobile, tablet, and desktop.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-950/40"
          >
            Explore Movie Catalog &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};
