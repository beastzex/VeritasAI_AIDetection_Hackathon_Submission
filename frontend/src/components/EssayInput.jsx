import React, { useState } from 'react';
import { RefreshCw, Zap, ArrowRight } from 'lucide-react';

const PRESETS = [
  {
    name: "Authentic Common App",
    tag: "HUMAN_HIGH_VARIANCE",
    title: "The Solder Scent & The Cello Bridge",
    text: `The scent of melted rosin core solder always takes me back to my grandfather's cramped garage workshop in Ohio. When I was ten, we spent three weeks rewiring a shattered 1968 tube amplifier. It taught me patience in a way mathematics classes never could.

Transitioning to high school, I channeled that mechanical curiosity into computational biology. During my sophomore summer, I interned at the county water authority. We cut the daily processing time from four hours down to twenty-five minutes by building automated Python pipelines.

Admissions counselors often ask what drives an applicant. For me, it is the quiet satisfaction of troubleshooting broken systems, whether debugging code at 2 AM or tuning my cello's temperamental C-string.`
  },
  {
    name: "AI Synthetic Statement",
    tag: "AI_UNIFORM_DRIFT",
    title: "A Tapestry of Transformative Growth",
    text: `Throughout the multifaceted journey of my academic trajectory, I have consistently strived to broaden my intellectual horizons and embrace transformative opportunities for personal growth. In today's rapidly evolving globalized world, the intersection of technology and human empathy serves as a cornerstone for meaningful progress.

Moreover, my involvement in community leadership initiatives has further reinforced the vital importance of collaboration and resilience. In conclusion, life is a rich tapestry of perseverance, and I am eager to contribute my unwavering dedication and unique perspective to your esteemed university.`
  },
  {
    name: "Polished Hybrid Draft",
    tag: "HYBRID_POLISHED",
    title: "Community Garden Journey",
    text: `I started a neighborhood rooftop community garden in South Chicago because our block lacked fresh produce. We hauled thirty bags of soil up four flights of stairs every Saturday morning.

Moreover, it is undeniably evident that community agricultural initiatives represent a pivotal paradigm shift in modern urban ecology. By fostering multifaceted civic engagement, we successfully empowered marginalized youth to cultivate sustainable food networks.

Looking ahead to college, I hope to major in environmental engineering to design larger-scale hydroponic infrastructure.`
  },
  {
    name: "Non-Native ESL Benchmark",
    tag: "ESL_AUTHENTIC",
    title: "Learning Astronomy in Tokyo",
    text: `When I was young in Tokyo, I looked at stars every night through small telescope my uncle bought. Because of light pollution, many stars were invisible, but Jupiter was always very bright.

Furthermore, I practiced English every day by reading astronomy articles and translating them word by word into Japanese notebooks. In conclusion, although English is not my mother language, my passion for astrophysics has no language barrier and I want to study hard at university.`
  }
];

export default function EssayInput({ onAnalyze, isAnalyzing }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const handlePreset = (preset) => {
    setText(preset.text);
    setTitle(preset.title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isAnalyzing) return;
    onAnalyze({ text, title });
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="tg-card p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#111113] dark:to-[#08080a] border border-[#ebebeb] dark:border-[#27272a] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebebeb] dark:border-[#27272a] pb-4">
        <div>
          <span className="tg-eyebrow block mb-1">
            SERVERLESS FORENSIC WORKBENCH
          </span>
          <h3 className="text-2xl font-medium tracking-tight text-[#000000] dark:text-white">
            Admissions Submission & Signal Extraction
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#959494] dark:text-[#a1a1aa] bg-[#f4f4f5] dark:bg-gradient-to-b dark:from-[#1c1c1f] dark:to-[#121214] px-3 py-1.5 rounded-[4px] border border-[#ebebeb] dark:border-[#27272a]">
          <span>{wordCount} WORDS</span>
          <span>•</span>
          <span>{text.length} CHARACTERS</span>
        </div>
      </div>

      {/* Preset Cards with Dark Gradient Fill */}
      <div className="space-y-2">
        <span className="tg-eyebrow block">
          LOAD REFERENCE BENCHMARK SAMPLES:
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePreset(p)}
              className="p-3.5 rounded-[4px] text-left bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] dark:from-[#1c1c20] dark:to-[#121215] border border-[#ebebeb] dark:border-[#27272a] hover:border-[#fc4c02] dark:hover:border-[#fc4c02] transition-all group"
            >
              <div className="tg-eyebrow text-[10px] text-[#959494] dark:text-[#a1a1aa] truncate">{p.tag}</div>
              <div className="text-sm font-medium text-[#000000] dark:text-white truncate group-hover:text-[#fc4c02] mt-0.5">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Input with Dark Gradient Fill */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Essay Title / Prompt Identifier (e.g., Common App Prompt 1)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-sm font-mono rounded-[4px] bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] focus:outline-none focus:border-[#fc4c02] dark:focus:border-[#fc4c02] text-[#000000] dark:text-white placeholder-[#959494] transition-all"
          />
        </div>

        <div>
          <textarea
            rows={8}
            placeholder="Paste applicant essay text here (minimum 2 sentences)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 text-sm font-sans rounded-[4px] bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#161619] dark:to-[#0f0f11] border border-[#ebebeb] dark:border-[#27272a] focus:outline-none focus:border-[#fc4c02] dark:focus:border-[#fc4c02] text-[#000000] dark:text-white placeholder-[#959494] leading-relaxed transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="text-xs text-[#959494] font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#fc4c02]" />
            <span>4 NON-LLM EXTRACTORS WILL SCORE SENTENCES CONCURRENTLY</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setText(''); setTitle(''); }}
              className="btn-outline-tg dark:bg-gradient-to-b dark:from-[#1c1c1f] dark:to-[#121214]"
            >
              CLEAR
            </button>
            <button
              type="submit"
              disabled={!text.trim() || isAnalyzing}
              className="btn-primary flex-1 sm:flex-none disabled:opacity-50 hover:bg-[#fc4c02] dark:hover:bg-[#fc4c02] dark:hover:text-white transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>COMPUTING SIGNALS...</span>
                </>
              ) : (
                <>
                  <span>ANALYZE IN STUDIO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
