import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export default function ClosingTealBand({ onActionClick }) {
  return (
    <section className="mt-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-[#0e3030] text-white rounded-[12px] p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle Inner Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#155555]/30 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155555]/60 text-xs font-semibold text-white">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Ready for Admissions Integrity</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.05]">
            Experience transparent admissions forensics in seconds.
          </h2>

          <p className="text-base text-[#bcbac9] leading-relaxed">
            Four independent analytical instruments. Zero chat-model judge verdicts. Built with mathematical accountability.
          </p>

          <div className="pt-2">
            <button
              onClick={onActionClick}
              className="btn-on-teal"
            >
              <span>Launch Live Detection Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
