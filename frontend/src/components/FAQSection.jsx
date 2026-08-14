import React, { useState } from 'react';
import { ChevronDown, Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "Why does Veritas never use an LLM (e.g. ChatGPT, Claude) to decide whether an essay is AI?",
      a: "Commercial LLMs are stochastic black boxes with unpredictable temperature shifts, hallucinations, and severe biases against formal ESL vocabularies. Veritas strictly uses regularized mathematical models (Dirichlet Log-Odds, Cosine Trajectory Variance, Stylometrics, and Supervised Sentence Attention) so every verdict is verifiable and auditable."
    },
    {
      q: "How does Signal B protect non-native (ESL) applicants from false accusations?",
      a: "Non-native writers frequently use structured GRE/SAT transitional adverbs (e.g., 'In conclusion', 'Moreover') that naive n-gram detectors penalize. Signal B measures narrative trajectory variance across consecutive sentence embeddings—confirming genuine experiential storytelling and dropping ESL false positives to 3.3%."
    },
    {
      q: "What datasets was the DeBERTa/RoBERTa sentence classifier trained on?",
      a: "The classifier was trained on 44,868 essays from the Kaggle DAIGT v2 dataset, augmented with 60 Groq Llama-3.3-70b synthetic personal statements and 35 polished hybrid drafts, split into stratified 80/10/10 train/val/test partitions."
    },
    {
      q: "Can admissions committees export PDF audit reports for admissions committees?",
      a: "Yes. Veritas outputs structured JSON payloads containing sentence-by-sentence classification bands (AI_SKEWED, UNCERTAIN, HUMAN_LIKE), quantitative signal breakdowns, and Groq post-hoc natural language summaries for applicant case files."
    }
  ];

  return (
    <section className="py-28 max-w-7xl mx-auto px-6 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="tg-eyebrow block">
          FREQUENTLY ASKED QUESTIONS // ADMISSIONS INTEGRITY & MATHEMATICS
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#000000] dark:text-white">
          Scientific Transparency & FAQ
        </h2>
        <p className="text-base sm:text-lg text-[#959494] leading-relaxed">
          Detailed answers on signal weighting, ESL fairness mitigations, and mathematical methodology.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="tg-card bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] rounded-[6px] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-base text-[#000000] dark:text-white hover:text-[#fc4c02] dark:hover:text-[#fc4c02] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="font-mono text-xs text-[#959494] flex-shrink-0">
                  {isOpen ? <Minus className="w-4 h-4 text-[#fc4c02]" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm text-[#959494] dark:text-[#a1a1aa] leading-relaxed border-t border-[#ebebeb] dark:border-[#27272a] font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
