import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';

export default function Footer({ onScrollToTop }) {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-[#ebebeb] dark:border-[#27272a] bg-white dark:bg-[#000000] pt-12 sm:pt-16 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-[#000000] dark:text-white">
              <div className="w-5 h-5 rounded-[2px] bg-[#fc4c02]" />
              <span>Veritas AI</span>
              <span className="font-mono text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-[2px] bg-[#ebebeb] dark:bg-[#18181b] text-[#000000] dark:text-white border border-[#ebebeb] dark:border-[#27272a]">
                V2.0-GA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#959494] leading-relaxed font-sans">
              The AI-native admissions essay forensics and statistical verification engine.
            </p>
          </div>

          <div className="font-mono text-[11px] sm:text-xs text-[#959494] space-y-1 bg-[#f9f9f9] dark:bg-[#0c0c0e] p-3.5 sm:p-4 rounded-[4px] border border-[#ebebeb] dark:border-[#27272a] w-full md:w-auto">
            <div className="text-[#000000] dark:text-white font-bold flex items-center gap-1.5 uppercase">
              <Lock className="w-3.5 h-3.5 text-[#fc4c02]" />
              <span>STRICT NON-LLM VERDICT POLICY</span>
            </div>
            <div>VERDICTS COMPUTED VIA REGULARIZED LOGISTIC REGRESSION COMBINER.</div>
          </div>

          <button
            onClick={onScrollToTop}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[4px] flex items-center justify-center border border-[#ebebeb] dark:border-[#27272a] hover:border-black dark:hover:border-white hover:bg-[#f9f9f9] dark:hover:bg-[#18181b] text-[#000000] dark:text-white transition-colors flex-shrink-0"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-6 border-t border-[#ebebeb] dark:border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] sm:text-xs text-[#959494] text-center sm:text-left">
          <div>© 2026 VERITAS AI INC. // OPEN ADMISSIONS INTEGRITY RESEARCH</div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span>PYTORCH 2.6 CUDA</span>
            <span>•</span>
            <span>spaCy</span>
            <span>•</span>
            <span>FASTAPI</span>
            <span>•</span>
            <span>REACT</span>
          </div>
        </div>

        {/* Giant Footer Wordmark Banner - Solid Faint Stencil Tint */}
        <div className="pt-6 pb-2 sm:pt-8 sm:pb-4 text-center select-none pointer-events-none">
          <div className="text-[14vw] sm:text-[12vw] font-bold leading-none tracking-tighter text-[#ebebeb]/70 dark:text-[#27272a]/70 uppercase font-sans">
            veritas.ai
          </div>
        </div>
      </div>
    </footer>
  );
}
