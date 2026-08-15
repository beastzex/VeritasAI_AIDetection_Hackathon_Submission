import React from 'react';

export default function HeatmapViewer({ analysisResult, selectedSentence, onSelectSentence }) {
  if (!analysisResult) return null;

  const { paragraphs, all_sentences = [], sentence_distribution } = analysisResult;

  const getBandClass = (band) => {
    switch (band) {
      case 'high_ai':
      case 'AI_SKEWED':
        return 'tg-hl-ai';
      case 'uncertain':
      case 'UNCERTAIN':
        return 'tg-hl-uncertain';
      case 'human':
      case 'HUMAN_LIKE':
        return 'tg-hl-human';
      default:
        return 'tg-hl-human';
    }
  };

  return (
    <div className="tg-card p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#111113] dark:to-[#08080a] border border-[#ebebeb] dark:border-[#27272a]">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebebeb] dark:border-[#27272a] pb-4">
        <div>
          <span className="tg-eyebrow block mb-1">
            FORENSIC HEATMAP // DAW WORKBENCH
          </span>
          <h3 className="text-xl font-medium tracking-tight text-[#000000] dark:text-white">
            Sentence-Level Authenticity Heatmap
          </h3>
        </div>

        {/* Legend Badges */}
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold">
          <span className="px-2.5 py-1 rounded-[3px] bg-[#c8f6f9] text-[#000000] border border-[#a6eef2]">
            ● HUMAN (&lt;40%)
          </span>
          <span className="px-2.5 py-1 rounded-[3px] bg-[#e4e4e7] dark:bg-[#27272a] text-[#000000] dark:text-white border border-[#d4d4d8] dark:border-[#3f3f46]">
            ● MIXED (40-70%)
          </span>
          <span className="px-2.5 py-1 rounded-[3px] bg-[#fee2e2] dark:bg-[#450a0a] text-[#dc2626] dark:text-[#f87171] border border-[#fecaca] dark:border-[#7f1d1d]">
            ● AI (&gt;70%)
          </span>
        </div>
      </div>

      {/* Composition Ribbon */}
      {sentence_distribution && (
        <div className="space-y-1.5 font-mono text-xs text-[#959494]">
          <div className="flex items-center justify-between text-[11px]">
            <span>DOCUMENT SPECTRUM</span>
            <span>{all_sentences.length} EVALUATED SENTENCES</span>
          </div>
          <div className="h-2 w-full rounded-[2px] overflow-hidden flex bg-[#ebebeb] dark:bg-[#27272a]">
            <div style={{ width: `${sentence_distribution.human_ratio * 100}%` }} className="bg-[#000000] dark:bg-white" />
            <div style={{ width: `${(1 - sentence_distribution.human_ratio - sentence_distribution.ai_ratio) * 100}%` }} className="bg-[#a1a1aa]" />
            <div style={{ width: `${sentence_distribution.ai_ratio * 100}%` }} className="bg-[#fc4c02]" />
          </div>
        </div>
      )}

      {/* Structured Paragraphs Container */}
      <div className="space-y-6 pt-2 font-sans text-sm sm:text-base leading-relaxed">
        {paragraphs && paragraphs.length > 0 ? (
          paragraphs.map((p, pIdx) => (
            <div
              key={pIdx}
              className="p-5 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#959494] mb-2 pb-2 border-b border-[#ebebeb]/60 dark:border-[#27272a]/60">
                <span className="font-bold text-[#000000] dark:text-white uppercase">{p.paragraph_type || `Paragraph ${pIdx + 1}`}</span>
                <span>{p.sentences.length} {p.sentences.length === 1 ? 'sentence' : 'sentences'}</span>
              </div>

              <div className="leading-loose">
                {p.sentences.map((s, sIdx) => {
                  const sentText = s.sentence || s.text || '';
                  const isSelected = selectedSentence && (selectedSentence.sentence === sentText || selectedSentence.text === sentText);
                  const bandCls = getBandClass(s.band);

                  return (
                    <span
                      key={sIdx}
                      onClick={() => onSelectSentence(s)}
                      className={`inline-block mr-1.5 mb-1 px-1.5 py-0.5 rounded-[2px] cursor-pointer transition-all duration-150 ${bandCls} ${
                        isSelected ? 'ring-2 ring-[#fc4c02] dark:ring-[#fc4c02] font-medium' : 'hover:opacity-85'
                      }`}
                      title={`Sentence AI Risk: ${(s.ai_probability * 100).toFixed(1)}%`}
                    >
                      {sentText}{' '}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="leading-loose">
            {all_sentences.map((s, idx) => {
              const sentText = s.sentence || s.text || '';
              const isSelected = selectedSentence && (selectedSentence.sentence === sentText || selectedSentence.text === sentText);
              const bandCls = getBandClass(s.band);

              return (
                <span
                  key={idx}
                  onClick={() => onSelectSentence(s)}
                  className={`inline-block mr-1.5 mb-1 px-1.5 py-0.5 rounded-[2px] cursor-pointer transition-all duration-150 ${bandCls} ${
                    isSelected ? 'ring-2 ring-[#fc4c02] dark:ring-[#fc4c02] font-medium' : 'hover:opacity-85'
                  }`}
                  title={`Sentence AI Risk: ${(s.ai_probability * 100).toFixed(1)}%`}
                >
                  {sentText}{' '}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
