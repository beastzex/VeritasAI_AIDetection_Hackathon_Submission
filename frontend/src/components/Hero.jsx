import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ onExploreClick, onTestClick }) {
  const [selectedTrajectory, setSelectedTrajectory] = useState('human');

  const humanSamples = [0.25, 0.72, 0.20, 0.55, 0.88, 0.16, 0.65, 0.38, 0.78, 0.30, 0.60, 0.35];
  const aiSamples = [0.50, 0.52, 0.51, 0.50, 0.52, 0.50, 0.51, 0.50, 0.51, 0.52, 0.50, 0.51];

  const currentVector = selectedTrajectory === 'human' ? humanSamples : aiSamples;

  const handleLaunchStudio = () => {
    if (typeof onTestClick === 'function') {
      onTestClick();
    } else {
      const el = document.getElementById('workbench') || document.getElementById('studio');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResearchClick = () => {
    if (typeof onExploreClick === 'function') {
      onExploreClick();
    } else {
      const el = document.getElementById('architecture') || document.getElementById('research');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="bg-white dark:bg-[#000000] text-[#000000] dark:text-white py-12 sm:py-20 lg:py-28 px-4 sm:px-6 border-b border-[#ebebeb] dark:border-[#27272a] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Headline & Action Cluster */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#f9f9f9] dark:bg-[#18181b] border border-[#ebebeb] dark:border-[#27272a] text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[#959494] dark:text-[#a1a1aa]">
            <span className="w-2 h-2 rounded-[2px] bg-[#fc4c02]" />
            <span>AI-Native Admissions Forensics Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#000000] dark:text-white leading-[1.08] sm:leading-[1.05]">
            Build verifiable admissions integrity on <span className="text-[#fc4c02]">Veritas AI</span>.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#959494] max-w-xl leading-relaxed">
            Multi-signal statistical inference engine with four non-LLM feature extractors. Auditable sentence-level heatmaps with zero black-box scoring.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={handleLaunchStudio}
              className="btn-primary text-xs sm:text-[13px] !py-3 !px-5 sm:!px-6 hover:bg-[#fc4c02] dark:hover:bg-[#fc4c02] dark:hover:text-white transition-colors justify-center"
            >
              <span>LAUNCH INFERENCE STUDIO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResearchClick}
              className="btn-outline-tg text-xs sm:text-[13px] !py-3 !px-5 hover:border-[#fc4c02] justify-center"
            >
              <span>RESEARCH & PROOFS</span>
            </button>
          </div>

          {/* Quick Telemetry Chips */}
          <div className="pt-4 grid grid-cols-3 gap-3 sm:gap-6 font-mono text-[11px] sm:text-[12px] text-[#959494] border-t border-[#ebebeb] dark:border-[#27272a]">
            <div>
              ACCURACY: <span className="text-[#000000] dark:text-white font-bold block sm:inline">98.4%</span>
            </div>
            <div>
              ESL SPECIFICITY: <span className="text-[#fc4c02] font-bold block sm:inline">96.7%</span>
            </div>
            <div>
              ROC-AUC: <span className="text-[#000000] dark:text-white font-bold block sm:inline">0.9995</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Orange Waveform Module */}
        <div className="lg:col-span-5">
          <div className="tg-card dark:bg-[#0c0c0e] p-4 sm:p-6 space-y-4 shadow-sm dark:shadow-2xl relative border border-[#ebebeb] dark:border-[#27272a]">
            {/* Top Chrome */}
            <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-[#27272a] pb-3 gap-2">
              <div className="space-y-0.5 min-w-0">
                <span className="tg-eyebrow text-[9px] sm:text-[10px] block truncate">
                  SIGNAL B // NARRATIVE DRIFT TRAJECTORY
                </span>
                <div className="font-mono text-[11px] sm:text-xs text-[#000000] dark:text-white font-semibold truncate">
                  {selectedTrajectory === 'human' ? 'HUMAN_ESSAY (HIGH VARIANCE)' : 'AI_SYNTHETIC (MONOTONIC)'}
                </div>
              </div>

              {/* Segmented Control */}
              <div className="flex items-center bg-[#f4f4f5] dark:bg-[#18181b] p-0.5 rounded-[4px] border border-[#ebebeb] dark:border-[#27272a] font-mono text-[10px] sm:text-[11px]">
                <button
                  onClick={() => setSelectedTrajectory('human')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[3px] transition-all ${
                    selectedTrajectory === 'human'
                      ? 'bg-[#fc4c02] text-white font-bold shadow-sm'
                      : 'text-[#959494] hover:text-black dark:hover:text-white'
                  }`}
                >
                  HUMAN
                </button>
                <button
                  onClick={() => setSelectedTrajectory('ai')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[3px] transition-all ${
                    selectedTrajectory === 'ai'
                      ? 'bg-[#fc4c02] text-white font-bold shadow-sm'
                      : 'text-[#959494] hover:text-black dark:hover:text-white'
                  }`}
                >
                  AI
                </button>
              </div>
            </div>

            {/* Orange Spectrum Bar Visualizer */}
            <div className="bg-[#f9f9f9] dark:bg-[#000000] p-3 sm:p-4 rounded-[4px] border border-[#ebebeb] dark:border-[#27272a] space-y-3">
              <div className="flex items-end justify-between gap-1 sm:gap-1.5 h-16 sm:h-20 pt-2">
                {currentVector.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      style={{ height: `${val * 100}%` }}
                      className={`w-full rounded-[1px] transition-all duration-300 ${
                        selectedTrajectory === 'human'
                          ? 'bg-[#fc4c02]'
                          : 'bg-[#d4d4d8] dark:bg-[#27272a]'
                      }`}
                    />
                    <span className="text-[7px] sm:text-[8px] text-[#959494] font-mono">S{idx + 1}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#959494] pt-2 border-t border-[#ebebeb] dark:border-[#27272a]">
                <span>VAR: <strong className="text-[#fc4c02]">{selectedTrajectory === 'human' ? '0.02447' : '0.00018'}</strong></span>
                <span className="text-[#959494] dark:text-[#a1a1aa] text-[9px] sm:text-[11px]">MiniLM COSINE VELOCITY</span>
              </div>
            </div>

            <div className="font-mono text-[9px] sm:text-[10px] text-[#959494] flex items-center justify-between">
              <span>HARDWARE: RTX 3050 CUDA</span>
              <span>PYTORCH 2.6</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
