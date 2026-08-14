import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2 } from 'lucide-react';

export default function APIQuickstart() {
  const [lang, setLang] = useState('python');
  const [copied, setCopied] = useState(false);

  const snippets = {
    python: `import requests

# 1. Initialize Veritas Forensic Inference Endpoint
url = "https://api.veritas.ai/api/analyze"

payload = {
    "title": "Common App Personal Statement - Fall 2026",
    "text": "The scent of melted rosin core solder always takes me back..."
}

# 2. Execute parallel 4-signal feature extraction
response = requests.post(url, json=payload)
result = response.json()

# 3. Inspect sentence-level heatmaps & probability distribution
print(f"Overall AI Probability: {result['overall_ai_probability'] * 100:.1f}%")
print(f"Sentence Count: {len(result['all_sentences'])}")
for sent in result["all_sentences"][:3]:
    print(f"[{sent['band_label']}] {sent['sentence']}")`,
    curl: `curl -X POST "https://api.veritas.ai/api/analyze" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Admissions Essay Sample",
    "text": "The scent of melted rosin core solder always takes me back..."
  }'`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-28 max-w-7xl mx-auto px-6 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="tg-eyebrow block">
          DEVELOPER API // UNIVERSITIES & ADMISSIONS INTEGRATION
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#000000] dark:text-white">
          Programmatic Inference in One HTTP Call
        </h2>
        <p className="text-base sm:text-lg text-[#959494] leading-relaxed">
          Integrate multi-signal sentence heatmaps directly into Slate, Salesforce Education Cloud, or custom admissions management systems.
        </p>
      </div>

      <div className="max-w-4xl mx-auto tg-card bg-gradient-to-b from-[#ffffff] to-[#fafafa] dark:from-[#111113] dark:to-[#08080a] border border-[#ebebeb] dark:border-[#27272a] rounded-[6px] overflow-hidden shadow-lg">
        {/* Terminal Header */}
        <div className="bg-[#f4f4f5] dark:bg-[#161619] border-b border-[#ebebeb] dark:border-[#27272a] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fc4c02]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#a1a1aa]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#71717a]" />
            </div>
            <span className="font-mono text-xs text-[#959494] pl-2 border-l border-[#ebebeb] dark:border-[#27272a]">
              POST /api/analyze — 4-Signal Inference Pipeline
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setLang('python')}
              className={`px-3 py-1 rounded-[3px] transition-all uppercase font-semibold ${
                lang === 'python'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-[#959494] hover:text-black dark:hover:text-white'
              }`}
            >
              PYTHON SDK
            </button>
            <button
              onClick={() => setLang('curl')}
              className={`px-3 py-1 rounded-[3px] transition-all uppercase font-semibold ${
                lang === 'curl'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-[#959494] hover:text-black dark:hover:text-white'
              }`}
            >
              cURL
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-[3px] hover:bg-[#ebebeb] dark:hover:bg-[#27272a] text-[#959494] transition-colors ml-1"
              title="Copy snippet"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 sm:p-8 bg-[#fafafa] dark:bg-[#0c0c0e] font-mono text-xs text-[#000000] dark:text-[#f4f4f5] overflow-x-auto leading-relaxed">
          <pre>
            <code>{snippets[lang]}</code>
          </pre>
        </div>

        {/* Footer Meta */}
        <div className="px-6 py-4 bg-[#f4f4f5] dark:bg-[#161619] border-t border-[#ebebeb] dark:border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-[#959494]">
          <div>RESPONSE TIME: ~380ms (GPU CUDA 12.4 RTX 3050)</div>
          <div>STRICT NON-LLM VERDICT PROTOCOL</div>
        </div>
      </div>
    </section>
  );
}
