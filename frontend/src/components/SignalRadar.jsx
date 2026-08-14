import React from 'react';
import { BookMarked, GitCommit, FileSpreadsheet, Brain } from 'lucide-react';

export default function SignalRadar({ essayMetrics }) {
  if (!essayMetrics) return null;

  const {
    signal_a_vocab,
    signal_b_narrative,
    signal_c_stylometry,
    signal_d_classifier
  } = essayMetrics;

  return (
    <div className="tg-card p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#111113] dark:to-[#08080a] border border-[#ebebeb] dark:border-[#27272a]">
      <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-[#27272a] pb-4">
        <div>
          <span className="tg-eyebrow block mb-1">
            AGGREGATE DIAGNOSTIC VECTORS // TELEMETRY
          </span>
          <h3 className="text-xl font-medium tracking-tight text-[#000000] dark:text-white">
            Document Diagnostic Telemetry
          </h3>
        </div>
        <span className="tg-eyebrow px-3 py-1 rounded-[3px] bg-[#f4f4f5] dark:bg-[#18181b] border border-[#ebebeb] dark:border-[#27272a]">
          CALIBRATED VIA COMBINER (β)
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Signal A */}
        <div className="p-4 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#000000] dark:text-white font-bold uppercase">
            <BookMarked className="w-3.5 h-3.5 text-[#fc4c02]" />
            <span>Signal A // Vocab</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#000000] dark:text-white">
            {signal_a_vocab.matched_count}
          </div>
          <p className="text-[11px] text-[#959494] font-mono">DENSITY: {(signal_a_vocab.density * 100).toFixed(1)}%</p>
        </div>

        {/* Signal B */}
        <div className="p-4 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#000000] dark:text-white font-bold uppercase">
            <GitCommit className="w-3.5 h-3.5 text-[#fc4c02]" />
            <span>Signal B // Variance</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#000000] dark:text-white">
            {signal_b_narrative.variance.toFixed(4)}
          </div>
          <p className="text-[11px] text-[#959494] font-mono">MEAN SIM: {signal_b_narrative.mean_similarity.toFixed(3)}</p>
        </div>

        {/* Signal C */}
        <div className="p-4 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#000000] dark:text-white font-bold uppercase">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#fc4c02]" />
            <span>Signal C // Burst</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#000000] dark:text-white">
            {signal_c_stylometry.sentence_length_variance.toFixed(1)}
          </div>
          <p className="text-[11px] text-[#959494] font-mono">TTR: {signal_c_stylometry.type_token_ratio.toFixed(2)}</p>
        </div>

        {/* Signal D */}
        <div className="p-4 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#000000] dark:text-white font-bold uppercase">
            <Brain className="w-3.5 h-3.5 text-[#fc4c02]" />
            <span>Signal D // Context</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#000000] dark:text-white">
            {(signal_d_classifier.mean_ai_probability * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-[#959494] font-mono">RoBERTa Context</p>
        </div>
      </div>
    </div>
  );
}
