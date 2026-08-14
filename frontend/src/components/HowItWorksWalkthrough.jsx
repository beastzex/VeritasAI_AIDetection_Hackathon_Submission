import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorksWalkthrough({ onTryDetectorClick }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      code: "STAGE_01",
      title: "Segmentation & Tokenization",
      subtitle: "Decomposing into sentence units",
      description: "When an applicant's essay is submitted, VeritasAI breaks the text into structural sections (Introduction, Body Paragraphs, Conclusion) and discrete sentences using linguistic boundary tokenizers.",
      defense: "Eliminates opaque document-level averages in favor of sentence-by-sentence scrutiny."
    },
    {
      code: "STAGE_02",
      title: "4-Signal Parallel Extraction",
      subtitle: "Multi-dimensional statistical audit",
      description: "Every sentence undergoes 4 concurrent non-LLM evaluations: Dirichlet Log-Odds for hallmark n-grams, MiniLM Cosine Trajectory Sequence for semantic jumps, spaCy Stylometrics for burstiness/TTR, and Supervised Sentence Attention.",
      defense: "Multi-signal synthesis protects against single-metric false positives."
    },
    {
      code: "STAGE_03",
      title: "Combiner Calibration & Fusion",
      subtitle: "Regularized Logistic Regression (β)",
      description: "The 8-dimensional feature vector is passed to our calibrated Combiner model. The defended weights scale raw metrics into reliable probability bands: Human-Like (<40%), Uncertain (40-70%), and AI-Skewed (>70%).",
      defense: "Negative weight on length variance (-0.4817) actively protects authentic human essays."
    },
    {
      code: "STAGE_04",
      title: "Heatmap & Post-Hoc Narration",
      subtitle: "Interactive inspection & explanation",
      description: "Color-coded heatmaps highlight sentence evidence. Clicking any sentence invokes the Groq LLM service to translate the mathematical signal metrics into an objective, plain-English explanation.",
      defense: "Strictly auditable for students, university admissions boards, and faculty reviewers."
    }
  ];

  return (
    <section id="walkthrough" className="py-20 border-b border-zinc-200 dark:border-zinc-850 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="eyebrow-tag">03 / Operational Sequence</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-black dark:text-white">
            Forensic Analysis Pipeline
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 font-mono max-w-md">
          How VeritasAI processes an incoming admissions essay from raw text to auditable sentence evidence.
        </p>
      </div>

      {/* 4 Pipeline Stages (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t border-l border-zinc-200 dark:border-zinc-850">
        {steps.map((s, idx) => {
          const isSelected = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-6 text-left border-r border-b border-zinc-200 dark:border-zinc-850 transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-950 text-black dark:text-white'
              }`}
            >
              <div className={`font-mono text-xs font-bold mb-3 ${isSelected ? 'text-blue-200' : 'text-blue-600 dark:text-blue-400'}`}>
                {s.code}
              </div>
              <h3 className="text-sm font-bold leading-snug">{s.title}</h3>
              <p className={`text-xs mt-1 font-mono ${isSelected ? 'text-blue-100' : 'text-zinc-500'}`}>
                {s.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Breakdown */}
      <div className="p-8 border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
            {steps[activeStep].code} • Technical Specification
          </div>
          <h3 className="text-xl font-bold text-black dark:text-white">
            {steps[activeStep].title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            {steps[activeStep].description}
          </p>
          <div className="pt-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <strong>RATIONALE:</strong> {steps[activeStep].defense}
          </div>
        </div>

        <button
          onClick={onTryDetectorClick}
          className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <span>Test In Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
