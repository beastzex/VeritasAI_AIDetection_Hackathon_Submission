import os
import sys
import re
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add current directory to path
sys.path.append(os.path.abspath("."))
sys.path.append(os.path.abspath("backend"))

from backend.signals.vocabulary import VocabularySignal
from backend.signals.narrative import NarrativeSignal
from backend.signals.stylometry import StylometrySignal
from backend.signals.classifier import ClassifierSignal
from backend.combine import SignalCombiner
from backend.explainer import ExplainerService

app = FastAPI(
    title="AI Admissions Essay Detector API",
    description="Multi-signal transparent AI essay analysis without LLM verdict dependency.",
    version="1.0.0"
)

# Enable robust CORS for Vercel, localhost, and all cloud origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:\d+",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy singletons for memory safety and instant port binding (< 0.05s)
_vocab_sig = None
_narrative_sig = None
_stylo_sig = None
_clf_sig = None
_combiner = None
_explainer = None

def get_vocab_sig():
    global _vocab_sig
    if _vocab_sig is None:
        _vocab_sig = VocabularySignal()
    return _vocab_sig

def get_narrative_sig():
    global _narrative_sig
    if _narrative_sig is None:
        _narrative_sig = NarrativeSignal()
    return _narrative_sig

def get_stylo_sig():
    global _stylo_sig
    if _stylo_sig is None:
        _stylo_sig = StylometrySignal()
    return _stylo_sig

def get_clf_sig():
    global _clf_sig
    if _clf_sig is None:
        _clf_sig = ClassifierSignal()
    return _clf_sig

def get_combiner():
    global _combiner
    if _combiner is None:
        _combiner = SignalCombiner()
    return _combiner

def get_explainer():
    global _explainer
    if _explainer is None:
        _explainer = ExplainerService()
    return _explainer

class AnalyzeRequest(BaseModel):
    text: str
    title: Optional[str] = "Admissions Essay"

class ExplainRequest(BaseModel):
    sentence_data: Dict[str, Any]
    essay_context: Optional[str] = ""

def split_into_paragraphs_and_sentences(text: str):
    raw_paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    if not raw_paragraphs:
        raw_paragraphs = [text.strip()]
        
    paragraphs_structure = []
    all_sentences = []
    
    # Try spaCy or clean regex fallback
    nlp = None
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm", disable=["ner"])
    except Exception:
        nlp = None
        
    for p_idx, p_text in enumerate(raw_paragraphs):
        if nlp:
            doc = nlp(p_text)
            p_sents = [s.text.strip() for s in doc.sents if len(s.text.strip()) > 3]
        else:
            p_sents = [s.strip() for s in re.split(r"(?<=[.!?])\s+", p_text) if len(s.strip()) > 3]
            
        if not p_sents:
            p_sents = [p_text]
            
        # Determine paragraph role (intro, body, conclusion)
        if p_idx == 0:
            p_type = "Introduction / Opening Hook"
        elif p_idx == len(raw_paragraphs) - 1 and len(raw_paragraphs) > 1:
            p_type = "Conclusion / Final Reflection"
        else:
            p_type = f"Body Paragraph {p_idx}"
            
        paragraphs_structure.append({
            "paragraph_index": p_idx,
            "paragraph_type": p_type,
            "text": p_text,
            "sentence_indices": list(range(len(all_sentences), len(all_sentences) + len(p_sents))),
            "sentences": p_sents
        })
        all_sentences.extend(p_sents)
        
    return paragraphs_structure, all_sentences

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Veritas AI Admissions Forensics Engine",
        "docs_url": "/docs",
        "api_analyze": "/api/analyze",
        "api_eval": "/api/eval-metrics"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "signals_loaded": {
            "signal_a_vocab": get_vocab_sig().loaded,
            "signal_b_narrative": True,
            "signal_c_stylometry": True,
            "signal_d_deberta": get_clf_sig().model is not None,
            "combiner_loaded": get_combiner().model is not None
        }
    }

@app.post("/api/analyze")
def analyze_essay(req: AnalyzeRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Essay text cannot be empty.")
        
    paragraphs_meta, sentences = split_into_paragraphs_and_sentences(text)
    if not sentences:
        raise HTTPException(status_code=400, detail="Unable to parse sentences from input.")
        
    # 1. Signal A: Vocabulary Signature Match (Log-Odds)
    vocab_results = get_vocab_sig().score_sentences(sentences)
    essay_vocab = get_vocab_sig().compute_essay_density(sentences)
    
    # 2. Signal B: Narrative Drift Trajectory
    essay_narrative = get_narrative_sig().compute_trajectory(sentences)
    
    # 3. Signal C: Stylometrics & Readability
    sentence_stylos = [get_stylo_sig().compute_sentence_stylometrics(s) for s in sentences]
    essay_stylos = get_stylo_sig().compute_essay_stylometrics(sentences, text)
    
    # 4. Signal D: Supervised Attention Classifier
    clf_predictions = get_clf_sig().predict_sentences(sentences)
    
    # Combine signals per sentence
    analyzed_sentences = []
    for idx, sentence_text in enumerate(sentences):
        v_res = vocab_results[idx]
        s_res = sentence_stylos[idx]
        d_res = clf_predictions[idx]
        
        sig_data = {
            "sentence_index": idx,
            "text": sentence_text,
            "sig_a_vocab_matches": v_res["matched_phrases"],
            "sig_a_vocab_score": v_res["sentence_score"],
            "sig_a_vocab_density": essay_vocab["density"],
            "sig_b_narrative_variance_score": essay_narrative["score"],
            "sig_c_ttr": s_res["ttr"],
            "sig_c_passive_voice": s_res["passive_voice"],
            "sig_c_transition_count": s_res["transition_count"],
            "sig_c_heuristic_score": s_res["score"],
            "sig_c_length_variance": essay_stylos["sentence_length_variance"],
            "sig_c_readability": essay_stylos["flesch_reading_ease"],
            "sig_d_deberta_prob": d_res["ai_prob"]
        }
        
        combined_result = get_combiner().combine_sentence(sig_data)
        analyzed_sentences.append(combined_result)
        
    # Aggregate paragraph summaries
    analyzed_paragraphs = []
    section_breakdown = []
    
    for p_info in paragraphs_meta:
        p_sent_indices = p_info["sentence_indices"]
        p_sents = [analyzed_sentences[i] for i in p_sent_indices if i < len(analyzed_sentences)]
        
        total_p_sents = max(len(p_sents), 1)
        p_high_count = sum(1 for s in p_sents if s["band"] == "high_ai")
        p_uncertain_count = sum(1 for s in p_sents if s["band"] == "uncertain")
        p_human_count = sum(1 for s in p_sents if s["band"] == "human")
        
        p_summary = {
            "paragraph_index": p_info["paragraph_index"],
            "paragraph_type": p_info["paragraph_type"],
            "sentences": p_sents,
            "distribution": {
                "ai_percentage": round((p_high_count / total_p_sents) * 100, 1),
                "uncertain_percentage": round((p_uncertain_count / total_p_sents) * 100, 1),
                "human_percentage": round((p_human_count / total_p_sents) * 100, 1)
            }
        }
        analyzed_paragraphs.append(p_summary)
        section_breakdown.append({
            "section": p_info["paragraph_type"],
            "total_sentences": total_p_sents,
            "sentence_count": total_p_sents,
            "ai_count": p_high_count,
            "uncertain_count": p_uncertain_count,
            "human_count": p_human_count,
            "distribution": p_summary["distribution"]
        })
        
    # Aggregate signal metrics
    total_sents = max(len(analyzed_sentences), 1)
    total_ai_sents = sum(1 for s in analyzed_sentences if s["band"] == "high_ai")
    total_unc_sents = sum(1 for s in analyzed_sentences if s["band"] == "uncertain")
    total_hum_sents = sum(1 for s in analyzed_sentences if s["band"] == "human")
    
    return {
        "title": req.title,
        "total_sentences": total_sents,
        "total_words": len(re.findall(r"\b\w+\b", text)),
        "sentence_distribution": {
            "ai_skewed_count": total_ai_sents,
            "uncertain_count": total_unc_sents,
            "human_count": total_hum_sents,
            "ai_ratio": round(total_ai_sents / total_sents, 3),
            "human_ratio": round(total_hum_sents / total_sents, 3)
        },
        "section_breakdown": section_breakdown,
        "paragraphs": analyzed_paragraphs,
        "all_sentences": analyzed_sentences,
        "signals_summary": {
            "signal_a_vocabulary": {
                "name": "Signal A: Vocabulary Signature",
                "score": essay_vocab["score"],
                "density": essay_vocab["density"],
                "total_matched_phrases": essay_vocab["total_matches"],
                "top_matches": essay_vocab["matched_phrases"]
            },
            "signal_b_narrative": {
                "name": "Signal B: Narrative Trajectory Variance",
                "score": essay_narrative["score"],
                "variance": essay_narrative["variance"],
                "mean_similarity": essay_narrative["mean_similarity"],
                "trajectory": essay_narrative["trajectory"],
                "is_monotonic_ai": essay_narrative.get("is_monotonic_ai", False)
            },
            "signal_c_stylometrics": {
                "name": "Signal C: Stylometrics & Readability",
                "sentence_length_variance": essay_stylos["sentence_length_variance"],
                "mean_sentence_length": essay_stylos["mean_sentence_length"],
                "macro_ttr": essay_stylos["macro_ttr"],
                "flesch_reading_ease": essay_stylos["flesch_reading_ease"],
                "flesch_kincaid_grade": essay_stylos["flesch_kincaid_grade"],
                "burstiness_ai_score": essay_stylos["burstiness_ai_score"]
            },
            "signal_d_classifier": {
                "name": "Signal D: Supervised Sentence Attention",
                "model_present": get_clf_sig().model is not None,
                "mean_ai_prob": round(sum(d["ai_prob"] for d in clf_predictions) / total_sents, 3)
            }
        }
    }

@app.post("/api/explain")
def explain_sentence(req: ExplainRequest):
    explanation = get_explainer().generate_explanation(
        sentence_data=req.sentence_data,
        essay_context=req.essay_context
    )
    return explanation

@app.get("/api/eval-metrics")
def get_evaluation_metrics():
    import json
    report_path = "eval/eval_report.json"
    if os.path.exists(report_path):
        with open(report_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "status": "unavailable",
        "message": "Evaluation report not generated yet. Run python eval/evaluate.py"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
