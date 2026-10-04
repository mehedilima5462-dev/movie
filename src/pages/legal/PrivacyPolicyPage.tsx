import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#080808] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-neutral-300 text-sm leading-relaxed">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Last Updated: March 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            MovieHub BD collects information you provide directly, such as your email address, account display name, and authentication credentials when registering an account. When navigating the catalog, we also maintain watch history progress and favorite bookmarks stored securely within your account profile.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Use of Information</h2>
          <p>
            Your information is used solely to provide personalized catalog experiences, maintain playback preferences, recommend related titles, and secure administrator sessions. We do not sell or monetize personal user data to third-party advertising exchanges.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Cookies &amp; Local Storage</h2>
          <p>
            We use modern browser local storage and essential session cookies to remember authentication state, filter selections, and video playback volumes. You may clear your browser cache and local storage at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Data Security</h2>
          <p>
            Account authentication and database operations are governed by Google Firebase security protocols with strict role-based access rules. User passwords are encrypted by Firebase Auth and are never viewable by site administrators.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
          <p>
            For privacy inquiries or account data deletion requests, contact privacy@moviehubbd.com.
          </p>
        </section>
      </div>
    </div>
  );
};
