import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-[#080808] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-neutral-300 text-sm leading-relaxed">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Last Updated: March 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using MovieHub BD, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, please do not use the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Permitted Use &amp; Authorized Media</h2>
          <p>
            MovieHub BD operates strictly as an informational movie discovery platform and authorized streaming showcase. Users agree not to scrape, bypass digital controls, redistribute unauthorized streams, or reverse engineer any application endpoints.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Intellectual Property Rights</h2>
          <p>
            All movie titles, posters, trademarks, and associated media are the intellectual property of their respective production houses, studios, and copyright holders. MovieHub BD displays metadata under promotional fair-use agreements or direct creator distribution licenses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your credentials. MovieHub BD reserves the right to terminate accounts that attempt to abuse platform resources or security configurations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Disclaimer of Warranties</h2>
          <p>
            The services and preview media are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind.
          </p>
        </section>
      </div>
    </div>
  );
};
