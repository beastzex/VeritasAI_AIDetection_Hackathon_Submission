import React from 'react';
import { Terminal, BookMarked, GitCommit, FileSpreadsheet, Brain, Sparkles } from 'lucide-react';

export default function WhyInspector({ selectedSentence, essayContext, onExplainSentence, isExplaining, currentExplanation }) {
  if (!selectedSentence) {
    return (
      <div className="tg-card p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[350px] bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#111113] dark:to-[#08080a] border border-[#ebebeb] dark:border-[#27272a]">
        <div className="w-12 h-12 rounded-[4px] bg-[#f4f4f5] dark:bg-gradient-to-b dark:from-[#1c1c1f] dark:to-[#121214] border border-[#ebebeb] dark:border-[#27272a] flex items-center justify-center text-[#959494]">
          <Terminal className="w-6 h-6" />
        </div>
        <h4 className="text-base font-medium text-[#000000] dark:text-white">Sentence Signal Inspector</h4>
        <p className="text-xs text-[#959494] max-w-xs leading-relaxed font-mono">
          SELECT ANY HIGHLIGHTED SENTENCE IN THE HEATMAP TO INSPECT 4 QUANTITATIVE SIGNALS AND TRIGGER GROQ NARRATION.
        </p>
      </div>
    );
  }

  const sentence = selectedSentence.sentence || selectedSentence.text || '';
  const band = selectedSentence.band || '';
  const band_label = selectedSentence.band_label || '';
  const ai_probability = selectedSentence.ai_probability || 0;
  const signals = selectedSentence.signals || {};

  const signal_a_vocab = signals.signal_a_vocabulary || signals.signal_a || selectedSentence.signal_a_vocab || {};
  const signal_b_narrative = signals.signal_b_narrative || signals.signal_b || selectedSentence.signal_b_narrative || {};
  const signal_c_stylometry = signals.signal_c_stylometry || signals.signal_c || selectedSentence.signal_c_stylometry || {};
  const signal_d_classifier = signals.signal_d_classifier || signals.signal_d || selectedSentence.signal_d_classifier || {};

  const matchedCount = signal_a_vocab?.matched_count ?? signal_a_vocab?.matches?.length ?? signal_a_vocab?.matched_phrases?.length ?? 0;
  const matches = signal_a_vocab?.matches || signal_a_vocab?.matched_phrases || [];

  return (
    <div className="tg-card p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#111113] dark:to-[#08080a] border border-[#ebebeb] dark:border-[#27272a]">
      {/* Inspector Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#ebebeb] dark:border-[#27272a] pb-4">
        <div>
          <span className="tg-eyebrow block mb-1">
            EVIDENCE AUDIT // QUANTITATIVE TELEMETRY
          </span>
          <h4 className="text-base font-medium text-[#000000] dark:text-white">
            {band_label || 'Sentence Inspection'}
          </h4>
        </div>
        <div className="font-mono text-xs font-bold px-3 py-1 rounded-[4px] bg-[#000000] text-white dark:bg-[#18181b] dark:border dark:border-[#27272a]">
          {((ai_probability || 0) * 100).toFixed(1)}% AI RISK
        </div>
      </div>

      {/* Selected Sentence Quote with Dark Gradient */}
      <div className="p-4 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] text-xs italic text-[#000000] dark:text-white leading-relaxed font-sans">
        "{sentence}"
      </div>

      {/* 4 Quantitative Signals with Dark Gradient Panels */}
      <div className="space-y-2.5 font-mono text-xs">
        {/* Signal A */}
        <div className="p-3.5 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1.5">
          <div className="flex justify-between items-center text-[#000000] dark:text-white font-bold">
            <span className="flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-[#fc4c02]" />
              <span>SIGNAL A // VOCABULARY</span>
            </span>
            <span>{matchedCount} MATCHES</span>
          </div>
          {matches.length > 0 ? (
            <div className="flex flex-wrap gap-1 pt-1 font-sans">
              {matches.map((m, i) => (
                <span key={i} className="px-2 py-0.5 rounded-[2px] bg-[#fee2e2] dark:bg-[#450a0a] text-[#dc2626] dark:text-[#f87171] text-[10px] border border-[#fecaca] dark:border-[#7f1d1d] font-mono font-bold">
                  {m.ngram} (Z: {Number(m.z_score || 0).toFixed(1)})
                </span>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-[#959494] font-sans">No hallmark AI n-grams detected.</div>
          )}
        </div>

        {/* Signal B */}
        <div className="p-3.5 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
          <div className="flex justify-between items-center text-[#000000] dark:text-white font-bold">
            <span className="flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-[#fc4c02]" />
              <span>SIGNAL B // TRAJECTORY</span>
            </span>
            <span>
              {signal_b_narrative?.score != null 
                ? Number(signal_b_narrative.score).toFixed(3) 
                : 'ANCHOR'}
            </span>
          </div>
          <div className="text-[11px] text-[#959494] font-sans">
            Consecutive MiniLM cosine drift to surrounding sentences.
          </div>
        </div>

        {/* Signal C */}
        <div className="p-3.5 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
          <div className="flex justify-between items-center text-[#000000] dark:text-white font-bold">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#fc4c02]" />
              <span>SIGNAL C // STYLOMETRICS</span>
            </span>
            <span>{signal_c_stylometry?.word_count || 0} TOKENS</span>
          </div>
          <div className="text-[11px] text-[#959494] font-sans flex flex-wrap gap-2">
            <span>TTR: {signal_c_stylometry?.ttr ?? signal_c_stylometry?.type_token_ratio ?? 0}</span>
            <span>•</span>
            <span>Transitions: {signal_c_stylometry?.transition_count || 0}</span>
            <span>•</span>
            <span>Passive: {signal_c_stylometry?.has_passive_voice ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Signal D */}
        <div className="p-3.5 rounded-[4px] bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] space-y-1">
          <div className="flex justify-between items-center text-[#000000] dark:text-white font-bold">
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[#fc4c02]" />
              <span>SIGNAL D // SUPERVISED</span>
            </span>
            <span>
              {signal_d_classifier?.ai_prob != null
                ? (signal_d_classifier.ai_prob * 100).toFixed(1)
                : signal_d_classifier?.ai_probability != null
                ? (signal_d_classifier.ai_probability * 100).toFixed(1)
                : '50.0'}%
            </span>
          </div>
          <div className="text-[11px] text-[#959494] font-sans">
            RoBERTa fine-tuned sentence classification inference.
          </div>
        </div>
      </div>

      {/* Groq Post-Hoc Narration with Dark Gradient */}
      <div className="pt-4 border-t border-[#ebebeb] dark:border-[#27272a] space-y-3">
        <div className="flex items-center justify-between">
          <span className="tg-eyebrow flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#fc4c02]" />
            <span>GROQ POST-HOC PLAIN-ENGLISH NARRATION</span>
          </span>
          <button
            onClick={() => onExplainSentence(selectedSentence)}
            disabled={isExplaining}
            className="btn-outline-tg text-[11px] !py-1 !px-3 hover:border-[#fc4c02] dark:hover:border-[#fc4c02]"
          >
            {isExplaining ? 'COMPUTING...' : 'REQUEST NARRATION'}
          </button>
        </div>

        {currentExplanation && (
          <div className="p-4 rounded-[4px] bg-gradient-to-b from-[#f9f9f9] to-[#f4f4f5] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] text-xs text-[#000000] dark:text-white leading-relaxed font-sans">
            <strong className="text-[#fc4c02] font-mono text-[10px] uppercase block mb-1">
              GROQ PLAIN-ENGLISH TRANSLATION:
            </strong>
            {currentExplanation}
          </div>
        )}
      </div>
    </div>
  );
}
