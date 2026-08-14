import React from 'react';
import { FileText, Cpu, Shield, Brain, Layers, Lock, Sparkles, BookOpen } from 'lucide-react';

export default function AboutTab() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">System Architecture & Ethical Disclosures</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          VeritasAI is an end-to-end multi-signal AI admissions essay detection architecture engineered to address the profound limitations of commercial black-box detectors. By combining deterministic statistical linguistics with calibrated machine learning, the system provides sentence-level transparency without allowing an LLM to decide the verdict.
        </p>
      </div>

      {/* The 4 Signals Explained */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Signal A */}
        <div className="glass-panel rounded-2xl p-5 border border-indigo-900/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center border border-indigo-700">
              <BookOpen className="w-4 h-4 text-indigo-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Signal A — Vocabulary Signature (Log-Odds)</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Computes Monroe et al. (2008) log-odds ratio with informative Dirichlet prior smoothing across the training corpus. Identifies n-grams systematically overrepresented in synthetic text (e.g. <em>"tapestry of"</em>, <em>"testament to"</em>, <em>"pivotal role"</em>). Requires minimum sentence density to prevent false positives on single isolated words.
          </p>
        </div>

        {/* Signal B */}
        <div className="glass-panel rounded-2xl p-5 border border-purple-900/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950 flex items-center justify-center border border-purple-700">
              <Layers className="w-4 h-4 text-purple-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Signal B — Narrative Trajectory Variance</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Uses <code>sentence-transformers/all-MiniLM-L6-v2</code> to calculate sentence embeddings and compute consecutive cosine similarity sequences. Evaluates the variance of semantic drift: synthetic essays drift smoothly with low variance, whereas authentic human essays exhibit organic narrative leaps, tangents, and tonal shifts.
          </p>
        </div>

        {/* Signal C */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-900/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-700">
              <Cpu className="w-4 h-4 text-cyan-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Signal C — Stylometric & Readability Vectors</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Pure linguistic extraction via spaCy and textstat. Measures sentence length variance, Type-Token Ratio (TTR vocabulary richness), discourse transition density, passive voice frequency, and Flesch-Kincaid grade level to quantify structural uniformity.
          </p>
        </div>

        {/* Signal D */}
        <div className="glass-panel rounded-2xl p-5 border border-rose-900/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-950 flex items-center justify-center border border-rose-700">
              <Brain className="w-4 h-4 text-rose-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Signal D — Fine-Tuned DeBERTa-v3-small</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            A supervised binary transformer fine-tuned on sentence segments from the DAIGT v2 dataset, Persuade 2.0 corpus, and custom Groq admissions samples. Trained under hardware constraints (RTX 3050 6GB VRAM, fp16, gradient checkpointing) for high-sensitivity context evaluation.
          </p>
        </div>
      </div>

      {/* Combiner & Strict Non-LLM Verdict Defense */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Strict Non-LLM Verdict Enforcement</h3>
        </div>

        <div className="p-4 rounded-xl bg-dark-900/90 border border-gray-700 text-xs text-gray-300 space-y-2">
          <p>
            <strong className="text-white">Core Ethical Rule:</strong> No LLM (chat completion model) is ever permitted to decide whether an essay or sentence is written by AI or Human. LLM judges suffer from extreme calibration drift, length bias, and prompt sensitivity.
          </p>
          <p>
            The final verdict is computed entirely by a calibrated <strong>Logistic Regression Combiner</strong> (<code>combiner_model.pkl</code>) taking the 4 quantitative signal vectors as input.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            Permitted LLM Roles (Transparent Disclosure)
          </h4>
          <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
            <li><strong>Synthetic Data Generation:</strong> Generating diverse synthetic admissions personal statements and polishing human drafts for training data diversification.</li>
            <li><strong>Post-Hoc Narration:</strong> Translating already-computed mathematical signal evidence into plain English for user accessibility. The LLM only receives the computed metrics after the verdict is final.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
