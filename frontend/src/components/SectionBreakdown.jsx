import React from 'react';

export default function SectionBreakdown({ sectionBreakdown }) {
  if (!sectionBreakdown || sectionBreakdown.length === 0) return null;

  return (
    <div className="tg-card p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#111113] dark:to-[#08080a] border border-[#ebebeb] dark:border-[#27272a]">
      <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-[#27272a] pb-4">
        <div>
          <span className="tg-eyebrow block mb-1">
            SECTION SPECTRUM // DOCUMENT COMPOSITION
          </span>
          <h3 className="text-xl font-medium tracking-tight text-[#000000] dark:text-white">
            Section-by-Section Authenticity Distribution
          </h3>
        </div>
        <span className="tg-eyebrow px-3 py-1 rounded-[3px] bg-[#f4f4f5] dark:bg-[#18181b] border border-[#ebebeb] dark:border-[#27272a]">
          NO ARBITRARY CUTOFFS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sectionBreakdown.map((sec, idx) => {
          const sectionTitle = sec.section || sec.paragraph_type || `Section ${idx + 1}`;
          const sentenceCount = sec.total_sentences ?? sec.sentence_count ?? sec.sentences?.length ?? 1;
          const distribution = sec.distribution || {
            human_percentage: sec.human_percentage ?? (sec.human_count ? (sec.human_count / sentenceCount) * 100 : 0),
            uncertain_percentage: sec.uncertain_percentage ?? (sec.uncertain_count ? (sec.uncertain_count / sentenceCount) * 100 : 0),
            ai_percentage: sec.ai_percentage ?? (sec.ai_count ? (sec.ai_count / sentenceCount) * 100 : 100)
          };
          const { human_percentage = 0, uncertain_percentage = 0, ai_percentage = 100 } = distribution;

          return (
            <div
              key={idx}
              className="p-5 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#000000] dark:text-white uppercase">{sectionTitle}</span>
                <span className="font-mono text-[10px] text-[#959494] px-2 py-0.5 rounded-[2px] bg-[#ebebeb] dark:bg-[#27272a]">
                  {sentenceCount} {sentenceCount === 1 ? 'SENT' : 'SENTS'}
                </span>
              </div>

              {/* Minimal Spectrum Bar */}
              <div className="h-2 w-full rounded-[2px] overflow-hidden flex bg-[#ebebeb] dark:bg-[#27272a]">
                <div style={{ width: `${human_percentage}%` }} className="bg-[#000000] dark:bg-white" />
                <div style={{ width: `${uncertain_percentage}%` }} className="bg-[#a1a1aa]" />
                <div style={{ width: `${ai_percentage}%` }} className="bg-[#fc4c02]" />
              </div>

              {/* Data Strip */}
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-center">
                <div className="p-2 rounded-[3px] bg-[#c8f6f9]/40 dark:bg-[#c8f6f9]/20 border border-[#c8f6f9]/60">
                  <div className="font-bold text-[#000000] dark:text-white">{Number(human_percentage).toFixed(0)}%</div>
                  <div className="text-[9px] text-[#959494] uppercase">HUMAN</div>
                </div>
                <div className="p-2 rounded-[3px] bg-[#e4e4e7] dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46]">
                  <div className="font-bold text-[#000000] dark:text-white">{Number(uncertain_percentage).toFixed(0)}%</div>
                  <div className="text-[9px] text-[#959494] uppercase">MIXED</div>
                </div>
                <div className="p-2 rounded-[3px] bg-[#fee2e2] dark:bg-[#450a0a] border border-[#fecaca] dark:border-[#7f1d1d]">
                  <div className="font-bold text-[#dc2626] dark:text-[#f87171]">{Number(ai_percentage).toFixed(0)}%</div>
                  <div className="text-[9px] text-[#959494] uppercase">AI</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
