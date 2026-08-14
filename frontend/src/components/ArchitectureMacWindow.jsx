import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function ArchitectureMacWindow() {
  const [activeTab, setActiveTab] = useState('math');

  return (
    <section id="research" className="bg-white dark:bg-[#000000] text-[#000000] dark:text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 border-t border-b border-[#ebebeb] dark:border-[#27272a] transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
          <span className="tg-eyebrow block text-[10px] sm:text-[11px]">
            GROUNDED IN CUTTING-EDGE RESEARCH // FORMAL DERIVATIONS
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#000000] dark:text-white">
            Mathematical Engine & Coefficient Defense
          </h2>
          <p className="text-sm sm:text-base text-[#959494] leading-relaxed">
            The exact mathematical formulations, Dirichlet priors, and regularized logistic regression proofs powering Veritas AI.
          </p>
        </div>

        {/* Tab Controls (Scrollable on small screens) */}
        <div className="flex items-center justify-center overflow-x-auto pb-1">
          <div className="bg-[#f9f9f9] dark:bg-[#18181b] p-1 rounded-[4px] font-mono text-[11px] sm:text-xs font-semibold inline-flex border border-[#ebebeb] dark:border-[#27272a] whitespace-nowrap">
            <button
              onClick={() => setActiveTab('math')}
              className={`px-3 sm:px-4 py-1.5 rounded-[3px] transition-all uppercase ${
                activeTab === 'math'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'text-[#959494] hover:text-black dark:hover:text-white'
              }`}
            >
              FORMULATIONS (β)
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 sm:px-4 py-1.5 rounded-[3px] transition-all uppercase ${
                activeTab === 'pipeline'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'text-[#959494] hover:text-black dark:hover:text-white'
              }`}
            >
              DATAFLOW PIPELINE
            </button>
            <button
              onClick={() => setActiveTab('ethics')}
              className={`px-3 sm:px-4 py-1.5 rounded-[3px] transition-all uppercase ${
                activeTab === 'ethics'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'text-[#959494] hover:text-black dark:hover:text-white'
              }`}
            >
              NON-LLM POLICY
            </button>
          </div>
        </div>

        {/* Console Workspace */}
        <div className="max-w-5xl mx-auto font-mono text-xs space-y-6">
          {activeTab === 'math' && (
            <div className="space-y-6">
              {/* Formula 1 */}
              <div className="p-4 sm:p-6 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#000000] dark:text-[#bdbbff] font-bold text-xs">
                  <span>[01] SIGNAL A // DIRICHLET PRIOR LOG-ODDS (MONROE ET AL. 2008)</span>
                  <span className="text-[10px] text-[#959494]">Z-SCORE NORMALIZATION</span>
                </div>
                <div className="p-3 sm:p-4 rounded-[3px] bg-white dark:bg-[#000000] border border-[#ebebeb] dark:border-[#27272a] text-[#000000] dark:text-[#c8f6f9] text-[10px] sm:text-[11px] overflow-x-auto leading-relaxed">
                  {"δ̂_w = log[ (y_w^(AI) + α_w) / (n^(AI) + α_0 - y_w^(AI) - α_w) ] - log[ (y_w^(Hum) + α_w) / (n^(Hum) + α_0 - y_w^(Hum) - α_w) ]"}
                  <br />
                  {"σ²(δ̂_w) ≈ 1 / (y_w^(AI) + α_w) + 1 / (y_w^(Hum) + α_w)"}
                  <br />
                  {"Z_w = δ̂_w / √( σ²(δ̂_w) )  ;  Significance Filter: Z_w ≥ 3.0"}
                </div>
                <p className="text-[#959494] font-sans text-xs">
                  Prior Dirichlet parameter α_w accounts for background vocabulary frequencies, preventing rare words from dominating the statistical signature list.
                </p>
              </div>

              {/* Formula 2 */}
              <div className="p-4 sm:p-6 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#000000] dark:text-[#ef2cc1] font-bold text-xs">
                  <span>[02] SIGNAL B // NARRATIVE COSINE TRAJECTORY VARIANCE (MINILM)</span>
                  <span className="text-[10px] text-[#959494]">SEMANTIC VELOCITY</span>
                </div>
                <div className="p-3 sm:p-4 rounded-[3px] bg-white dark:bg-[#000000] border border-[#ebebeb] dark:border-[#27272a] text-[#000000] dark:text-[#bdbbff] text-[10px] sm:text-[11px] overflow-x-auto leading-relaxed">
                  {"sim_i = cos( e_i, e_{i+1} ) = ( e_i · e_{i+1} ) / ( ||e_i||₂ ||e_{i+1}||₂ )"}
                  <br />
                  {"Var(S) = (1/M) ∑ ( sim_i - μ_sim )²"}
                </div>
                <p className="text-[#959494] font-sans text-xs">
                  AI embeddings progress with monotonic similarity (low variance). Human essays feature deliberate thematic pivots and emotional shifts (high variance).
                </p>
              </div>

              {/* Formula 3: Combiner Table */}
              <div className="p-4 sm:p-6 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#000000] dark:text-[#fc4c02] font-bold text-xs">
                  <span>[03] COMBINER // REGULARIZED LOGISTIC REGRESSION WEIGHT DEFENSE</span>
                  <span className="text-[10px] text-[#959494]">VAL ROC-AUC: 0.9996</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#ebebeb] dark:border-[#27272a] text-[#959494] text-[10px] uppercase">
                        <th className="py-2.5 px-3">FEATURE</th>
                        <th className="py-2.5 px-3">LEARNED β</th>
                        <th className="py-2.5 px-3 font-sans">ROLE IN DECISION BOUNDARY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebebeb] dark:divide-[#27272a]">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-[#000000] dark:text-[#c8f6f9]">sig_d_deberta_prob</td>
                        <td className="py-2.5 px-3 font-bold text-[#000000] dark:text-white">+6.3925</td>
                        <td className="py-2.5 px-3 font-sans text-[#959494]">Supervised transformer sentence attention anchor.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-[#000000] dark:text-[#bdbbff]">sig_a_vocab_density</td>
                        <td className="py-2.5 px-3 font-bold text-[#000000] dark:text-white">+1.5396</td>
                        <td className="py-2.5 px-3 font-sans text-[#959494]">Penalizes high concentration of hallmark AI n-grams.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-[#000000] dark:text-[#ef2cc1]">sig_b_narrative_variance</td>
                        <td className="py-2.5 px-3 font-bold text-[#000000] dark:text-white">+0.5673</td>
                        <td className="py-2.5 px-3 font-sans text-[#959494]">Penalizes robotic, flatline semantic progression.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-[#16a34a] dark:text-[#c8f6f9]">sig_c_length_variance</td>
                        <td className="py-2.5 px-3 font-bold text-[#16a34a] dark:text-[#c8f6f9]">-0.4817</td>
                        <td className="py-2.5 px-3 font-sans text-[#959494]"><strong>Human Protection:</strong> High burstiness in sentence length strongly reduces AI risk.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[#959494] font-bold">Intercept (β_0)</td>
                        <td className="py-2.5 px-3 font-bold text-[#959494]">-3.9193</td>
                        <td className="py-2.5 px-3 font-sans text-[#959494]">Conservative baseline threshold protecting applicants from false accusations.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="p-4 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a] text-[#959494]">
                <strong className="text-[#000000] dark:text-white font-mono uppercase">SYNCHRONOUS DATAFLOW: </strong>
                Incoming plain text is tokenized into structural paragraph units, scored in parallel by 4 non-LLM feature extractors, and evaluated by the calibrated Combiner model.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="p-4 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a]">
                  <div className="text-[10px] text-[#959494] uppercase">STAGE 01</div>
                  <div className="font-bold text-[#000000] dark:text-white mt-1 text-xs">SEGMENTATION</div>
                  <div className="text-[10px] text-[#959494] mt-0.5">spaCy tokenization</div>
                </div>
                <div className="p-4 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a]">
                  <div className="text-[10px] text-[#959494] uppercase">STAGE 02</div>
                  <div className="font-bold text-[#000000] dark:text-[#bdbbff] mt-1 text-xs">4-SIGNAL VECTOR</div>
                  <div className="text-[10px] text-[#959494] mt-0.5">Parallel GPU compute</div>
                </div>
                <div className="p-4 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a]">
                  <div className="text-[10px] text-[#959494] uppercase">STAGE 03</div>
                  <div className="font-bold text-[#000000] dark:text-[#c8f6f9] mt-1 text-xs">COMBINER (β)</div>
                  <div className="text-[10px] text-[#959494] mt-0.5">Logistic regression</div>
                </div>
                <div className="p-4 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a]">
                  <div className="text-[10px] text-[#959494] uppercase">STAGE 04</div>
                  <div className="font-bold text-[#000000] dark:text-[#ef2cc1] mt-1 text-xs">HEATMAP & GROQ</div>
                  <div className="text-[10px] text-[#959494] mt-0.5">Auditable sentence bands</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="space-y-4 font-sans text-xs text-[#959494]">
              <div className="p-4 sm:p-6 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a] space-y-2">
                <div className="flex items-center gap-2 font-mono text-[#000000] dark:text-[#c8f6f9] font-bold text-xs uppercase">
                  <Lock className="w-4 h-4" />
                  <span>Strict Non-LLM Verdict Standard</span>
                </div>
                <p className="leading-relaxed">
                  No LLM (e.g., ChatGPT, Claude, Llama) ever makes or votes on the authenticity verdict. All verdicts are mathematically computed by our regularized Logistic Regression Combiner based on extracted statistical linguistic markers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                <div className="p-4 sm:p-5 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
                  <span className="font-mono text-[10px] text-[#000000] dark:text-[#bdbbff] uppercase font-bold">Role 1: Synthetic Expansion</span>
                  <p>Groq API generated 60 personal statements and polished 35 drafts to harden training against hybrid submissions.</p>
                </div>
                <div className="p-4 sm:p-5 rounded-[4px] bg-[#f9f9f9] dark:bg-[#0c0c0e] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
                  <span className="font-mono text-[10px] text-[#000000] dark:text-[#bdbbff] uppercase font-bold">Role 2: Post-Hoc Narration</span>
                  <p>Groq API receives pre-computed signal metrics solely to explain why signals fired in plain English.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
