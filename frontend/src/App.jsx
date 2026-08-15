import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectOverview from './components/ProjectOverview';
import HowItWorksWalkthrough from './components/HowItWorksWalkthrough';
import WorkflowSteps from './components/WorkflowSteps';
import EssayInput from './components/EssayInput';
import HeatmapViewer from './components/HeatmapViewer';
import SignalRadar from './components/SignalRadar';
import WhyInspector from './components/WhyInspector';
import SectionBreakdown from './components/SectionBreakdown';
import ArchitectureMacWindow from './components/ArchitectureMacWindow';
import EvaluationTab from './components/EvaluationTab';
import APIQuickstart from './components/APIQuickstart';
import FAQSection from './components/FAQSection';
import ClosingTealBand from './components/ClosingTealBand';
import Footer from './components/Footer';

// In dev mode: empty string → Vite proxy forwards /api/* to localhost:8000
// In production: hardcoded Render URL for direct API calls with CORS
const API_BASE = import.meta.env.DEV ? '' : 'https://veritasai-oxc7.onrender.com';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem('veritas_tg_theme') || 'dark';
    setTheme(saved);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('veritas_tg_theme', newTheme);
  };

  const handleAnalyze = async ({ text, title }) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSelectedSentence(null);
    setCurrentExplanation(null);

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, title })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      data.raw_text = text;
      setAnalysisResult(data);

      if (data.all_sentences && data.all_sentences.length > 0) {
        const firstFlagged = data.all_sentences.find(s => s.band === 'high_ai' || s.band === 'uncertain' || s.band === 'AI_SKEWED') || data.all_sentences[0];
        setSelectedSentence(firstFlagged);
        // Auto-request plain English Groq narration for the first flagged sentence
        handleExplainSentence(firstFlagged, text);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg('Failed to connect to backend server. Make sure FastAPI is running on port 8000.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExplainSentence = async (sentenceData, textOverride) => {
    if (!sentenceData) return;
    setIsExplaining(true);
    setCurrentExplanation(null);

    try {
      const response = await fetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence_data: sentenceData,
          essay_context: textOverride || (analysisResult ? (analysisResult.raw_text || analysisResult.text) : '')
        })
      });

      if (!response.ok) {
        throw new Error(`Explanation server error: ${response.status}`);
      }

      const data = await response.json();
      const text = typeof data === 'string' ? data : (data.explanation || 'Explanation generated.');
      setCurrentExplanation(text);
    } catch (err) {
      console.error('Explanation error:', err);
      setCurrentExplanation('Statistical signature telemetry: Multiple analytical signals triggered simultaneously.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#000000] text-[#000000] dark:text-white transition-colors duration-200 antialiased font-sans selection:bg-[#fc4c02] selection:text-white">
      {/* 1. Global Navigation Bar with Lightswind View Transition Theme Toggle */}
      <Navbar theme={theme} setTheme={handleSetTheme} />

      {/* Main Content Sections with Generous Spacing */}
      <main className="space-y-28 md:space-y-36">
        {/* 2. Hero Section */}
        <Hero onSelectPreset={(presetText) => {
          const essayInput = document.getElementById('workbench');
          if (essayInput) {
            essayInput.scrollIntoView({ behavior: 'smooth' });
          }
        }} />

        {/* 3. High-Density Architectural Overview */}
        <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectOverview />
        </section>

        {/* 4. Three-Stage Pipeline Diagram */}
        <section id="pipeline" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <WorkflowSteps />
        </section>

        {/* 5. Four Signals Interactive Deep Dive */}
        <section id="signals" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorksWalkthrough />
        </section>

        {/* 6. Interactive Admissions Inference Workbench */}
        <section id="workbench" className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <EssayInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

          {errorMsg && (
            <div className="p-4 rounded-[4px] bg-[#fee2e2] dark:bg-[#450a0a] border border-[#fecaca] dark:border-[#7f1d1d] text-xs font-mono text-[#dc2626] dark:text-[#f87171] text-center">
              {errorMsg}
            </div>
          )}

          {analysisResult && (
            <div className="space-y-12 animate-fade-in">
              {/* Section Breakdown Spectrum */}
              {analysisResult.section_breakdown && (
                <SectionBreakdown sectionBreakdown={analysisResult.section_breakdown} />
              )}

              {/* 2-Column DAW Heatmap & Evidence Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <HeatmapViewer
                    analysisResult={analysisResult}
                    selectedSentence={selectedSentence}
                    onSelectSentence={(s) => {
                      setSelectedSentence(s);
                      setCurrentExplanation(null);
                    }}
                  />
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <WhyInspector
                    selectedSentence={selectedSentence}
                    essayContext={analysisResult.raw_text}
                    onExplainSentence={handleExplainSentence}
                    isExplaining={isExplaining}
                    currentExplanation={currentExplanation}
                  />

                  {analysisResult.signals_summary && (
                    <SignalRadar signalsSummary={analysisResult.signals_summary} />
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 7. Mac OS Mathematical Architecture Terminal */}
        <section id="architecture" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ArchitectureMacWindow />
        </section>

        {/* 8. Quantitative Evaluation & ESL Bias Benchmark */}
        <section id="evaluation" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EvaluationTab />
        </section>

        {/* 9. Developer API Quickstart */}
        <section id="api" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <APIQuickstart />
        </section>

        {/* 10. Frequently Asked Questions */}
        <section id="faq" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </section>

        {/* 11. Closing Call-To-Action Banner */}
        <ClosingTealBand />
      </main>

      {/* 12. Global Footer */}
      <Footer />
    </div>
  );
}
