import React from 'react';
import { BookMarked, GitCommit, FileSpreadsheet, Brain } from 'lucide-react';

export default function ProjectOverview() {
  return (
    <section id="overview" className="py-20 space-y-12">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="tg-eyebrow block">
          THE TOGETHER FORENSIC STACK // 4-SIGNAL ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#000000] dark:text-white">
          Four analytical instruments. Zero black boxes.
        </h2>
        <p className="text-base text-[#959494] leading-relaxed max-w-2xl mx-auto">
          Instead of issuing an arbitrary single percentage, Veritas computes four verifiable mathematical dimensions across each sentence and section.
        </p>
      </div>

      {/* 4 Feature Cards with Dark Gradient Fills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        {/* Signal A */}
        <div className="tg-card p-6 space-y-4 flex flex-col justify-between hover:border-[#fc4c02] dark:hover:border-[#fc4c02] bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] transition-all">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-[3px] bg-black dark:bg-[#27272a] text-white flex items-center justify-center font-mono text-xs font-bold">
              01
            </div>
            <div className="tg-eyebrow">
              SIGNAL A // STATISTICAL PRIOR
            </div>
            <h3 className="text-xl font-medium text-[#000000] dark:text-white tracking-tight">
              Dirichlet Log-Odds
            </h3>
            <p className="text-sm text-[#959494] leading-relaxed">
              Surfaces statistical hallmark AI n-grams from 27.5M tokens with variance-normalized Z-scores ($\ge 3.0$) and density thresholds.
            </p>
          </div>
          <div className="pt-3 border-t border-[#ebebeb] dark:border-[#27272a] font-mono text-xs text-[#000000] dark:text-white">
            WEIGHT: <span className="font-bold text-[#fc4c02]">+1.5396 (Density)</span>
          </div>
        </div>

        {/* Signal B */}
        <div className="tg-card p-6 space-y-4 flex flex-col justify-between hover:border-[#fc4c02] dark:hover:border-[#fc4c02] bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] transition-all">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-[3px] bg-black dark:bg-[#27272a] text-white flex items-center justify-center font-mono text-xs font-bold">
              02
            </div>
            <div className="tg-eyebrow">
              SIGNAL B // NARRATIVE DRIFT
            </div>
            <h3 className="text-xl font-medium text-[#000000] dark:text-white tracking-tight">
              Trajectory Variance
            </h3>
            <p className="text-sm text-[#959494] leading-relaxed">
              Tracks consecutive MiniLM sentence cosine similarity. Identifies robotic flatline uniformity versus human emotional tangents.
            </p>
          </div>
          <div className="pt-3 border-t border-[#ebebeb] dark:border-[#27272a] font-mono text-xs text-[#000000] dark:text-white">
            WEIGHT: <span className="font-bold text-[#fc4c02]">+0.5673 (Uniformity)</span>
          </div>
        </div>

        {/* Signal C */}
        <div className="tg-card p-6 space-y-4 flex flex-col justify-between hover:border-[#fc4c02] dark:hover:border-[#fc4c02] bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] transition-all">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-[3px] bg-black dark:bg-[#27272a] text-white flex items-center justify-center font-mono text-xs font-bold">
              03
            </div>
            <div className="tg-eyebrow">
              SIGNAL C // STYLOMETRICS
            </div>
            <h3 className="text-xl font-medium text-[#000000] dark:text-white tracking-tight">
              Burstiness & TTR
            </h3>
            <p className="text-sm text-[#959494] leading-relaxed">
              spaCy grammatical parsing for Type-Token Ratio, passive voice density, Flesch grade ease, and sentence length variance.
            </p>
          </div>
          <div className="pt-3 border-t border-[#ebebeb] dark:border-[#27272a] font-mono text-xs text-[#000000] dark:text-white">
            WEIGHT: <span className="font-bold text-emerald-500">-0.4817 (Burstiness Protects)</span>
          </div>
        </div>

        {/* Signal D */}
        <div className="tg-card p-6 space-y-4 flex flex-col justify-between hover:border-[#fc4c02] dark:hover:border-[#fc4c02] bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] transition-all">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-[3px] bg-black dark:bg-[#27272a] text-white flex items-center justify-center font-mono text-xs font-bold">
              04
            </div>
            <div className="tg-eyebrow">
              SIGNAL D // SUPERVISED
            </div>
            <h3 className="text-xl font-medium text-[#000000] dark:text-white tracking-tight">
              Sentence Attention
            </h3>
            <p className="text-sm text-[#959494] leading-relaxed">
              Supervised transformer classifier trained on RTX 3050 CUDA hardware for sentence boundary contextual sensitivity.
            </p>
          </div>
          <div className="pt-3 border-t border-[#ebebeb] dark:border-[#27272a] font-mono text-xs text-[#000000] dark:text-white">
            WEIGHT: <span className="font-bold text-[#fc4c02]">+6.3925 (Anchor)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
