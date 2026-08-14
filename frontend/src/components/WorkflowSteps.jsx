import React from 'react';
import { FileText, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WorkflowSteps() {
  const steps = [
    {
      num: "01",
      title: "Applicant Text Ingestion & Sentence Segmentation",
      desc: "Incoming personal statements and essays are parsed via spaCy NLP pipelines into discrete grammatical sentence units and structural paragraphs, maintaining original syntactic order.",
      tag: "STAGE 1 // SEGMENTATION"
    },
    {
      num: "02",
      title: "Concurrent 4-Signal Feature Extraction",
      desc: "Four non-LLM analytical pipelines compute Dirichlet n-gram log-odds, consecutive MiniLM cosine trajectory variance, Flesch/TTR burstiness metrics, and RoBERTa attention scores simultaneously.",
      tag: "STAGE 2 // PARALLEL INFERENCE"
    },
    {
      num: "03",
      title: "Calibrated Combiner Fusion & Groq Narration",
      desc: "A regularized Logistic Regression Combiner fuses the 8-dimensional signal vector into calibrated probabilities, generating sentence heatmaps and plain-English post-hoc explanations.",
      tag: "STAGE 3 // VERIFIABLE VERDICT"
    }
  ];

  return (
    <section className="py-28 max-w-7xl mx-auto px-6 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="tg-eyebrow block">
          HOW IT WORKS // END-TO-END ADMISSIONS WORKFLOW
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#000000] dark:text-white">
          Transparent Forensics in Three Automated Stages
        </h2>
        <p className="text-base sm:text-lg text-[#959494] leading-relaxed">
          From raw applicant submission to auditable sentence-level heatmaps in under 400 milliseconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="tg-card p-8 sm:p-10 space-y-6 bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] flex flex-col justify-between hover:border-[#fc4c02] dark:hover:border-[#fc4c02] transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-[#fc4c02]">
                  {step.num}
                </span>
                <span className="tg-eyebrow text-[10px] bg-[#f4f4f5] dark:bg-[#18181b] px-2.5 py-1 rounded-[3px] border border-[#ebebeb] dark:border-[#27272a]">
                  {step.tag}
                </span>
              </div>

              <h3 className="text-xl font-medium text-[#000000] dark:text-white tracking-tight leading-snug">
                {step.title}
              </h3>

              <p className="text-sm text-[#959494] leading-relaxed font-sans">
                {step.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-[#ebebeb] dark:border-[#27272a] flex items-center gap-2 font-mono text-xs text-[#959494] group-hover:text-[#fc4c02] transition-colors">
              <span>EXPLORE PIPELINE SPEC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
