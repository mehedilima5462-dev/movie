import React from 'react';
import { ShieldCheck, Mail, AlertCircle } from 'lucide-react';

export const DMCAPage: React.FC = () => {
  return (
    <div className="bg-[#080808] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-neutral-300 text-sm leading-relaxed">
        
        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Millennium Copyright Act Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            DMCA &amp; Copyright Policy
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Last Updated: March 2026</p>
        </div>

        {/* Strong Disclaimer Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="text-white block font-semibold">Important Content Disclaimer:</strong>
            <p className="text-neutral-300">
              MovieHub BD does not host pirated movies, crack files, torrent files, or unauthorized media streams on its servers. We operate as an informational movie discovery database and authorized media catalog for content owned by us, licensed to us, authorized by creators, or available in the public domain.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Notice and Takedown Procedure</h2>
          <p>
            MovieHub BD respects the intellectual property rights of others and adheres to the Digital Millennium Copyright Act (Title 17, United States Code, Section 512). If you believe that your copyrighted work has been listed or linked on this site in a manner that constitutes infringement, please submit a written takedown notice to our designated copyright agent containing:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-neutral-400 text-xs sm:text-sm">
            <li>Physical or electronic signature of the copyright holder or authorized representative.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Specific URL or direct link to the content on MovieHub BD that you request to be reviewed or removed.</li>
            <li>Contact details including full legal name, telephone number, and official email address.</li>
            <li>A good faith statement affirming that use of the material is not authorized by the copyright owner, agent, or the law.</li>
            <li>A statement, under penalty of perjury, that the information in the notice is accurate and that you are authorized to act on behalf of the owner.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Designated Copyright Agent</h2>
          <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Mail className="w-4 h-4 text-red-500" />
              <span>DMCA Agent Contact:</span>
            </div>
            <p className="text-neutral-300">MovieHub BD Legal Department</p>
            <p className="text-neutral-400">Email: dmca@moviehubbd.com</p>
            <p className="text-neutral-400">Response timeframe: 24 - 48 business hours</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Repeat Infringer Policy</h2>
          <p>
            In accordance with applicable law, MovieHub BD enforces a policy of terminating user access accounts and revoking catalog listing privileges of any submitter identified as a repeat infringer.
          </p>
        </section>

      </div>
    </div>
  );
};
