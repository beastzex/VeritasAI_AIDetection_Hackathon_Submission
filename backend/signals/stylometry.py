import re
import math
from typing import Dict, Any, List

class StylometrySignal:
    def __init__(self):
        self.nlp = None
        self._load_spacy()
        
    def _load_spacy(self):
        try:
            import spacy
            self.nlp = spacy.load("en_core_web_sm")
        except Exception as e:
            print(f"Notice: spaCy deferred load: {e}")
            self.nlp = None

    def compute_sentence_stylometrics(self, sentence: str) -> Dict[str, Any]:
        """Extracts sentence-level stylometric features."""
        words = re.findall(r"\b[a-zA-Z']+\b", sentence)
        num_words = len(words)
        if num_words == 0:
            return {
                "word_count": 0,
                "ttr": 0.0,
                "transition_count": 0,
                "passive_voice": False,
                "score": 0.5
            }
            
        unique_words = len(set(w.lower() for w in words))
        ttr = unique_words / num_words # Type-Token Ratio
        
        # Transition words common in formulaic AI writing
        transitions = [
            "furthermore", "moreover", "in conclusion", "additionally", "consequently",
            "nonetheless", "nevertheless", "subsequently", "henceforth", "as a result",
            "in essence", "ultimately", "it is evident", "notably", "significantly"
        ]
        sent_lower = sentence.lower()
        transition_count = sum(1 for t in transitions if t in sent_lower)
        
        # Passive voice detection
        has_passive = False
        if self.nlp:
            try:
                doc = self.nlp(sentence)
                for token in doc:
                    if token.dep_ in ["auxpass", "agent"] or (token.dep_ == "aux" and token.head.tag_ == "VBN" and token.text.lower() in ["is", "was", "were", "been", "being", "are"]):
                        has_passive = True
                        break
            except Exception:
                pass
        else:
            # Fallback regex passive heuristic (be + VBN suffix)
            if re.search(r"\b(is|was|were|been|being|are|be)\s+\w+ed\b", sent_lower):
                has_passive = True
                
        # AI text often features elevated formulaic transitions, medium-high uniform TTR, and passive constructions
        ai_risk = 0.0
        if transition_count >= 1:
            ai_risk += 0.35 * transition_count
        if has_passive:
            ai_risk += 0.15
        if 18 <= num_words <= 32: # AI sweet spot length
            ai_risk += 0.10
            
        score = min(max(round(1.0 / (1.0 + math.exp(-3.0 * (ai_risk - 0.4))), 4), 0.05), 0.95)
        
        return {
            "word_count": num_words,
            "ttr": round(ttr, 3),
            "transition_count": transition_count,
            "passive_voice": has_passive,
            "score": score
        }

    def compute_essay_stylometrics(self, text: str, sentences: List[str]) -> Dict[str, Any]:
        """Computes document-wide stylometric vectors."""
        lengths = [len(re.findall(r"\b\w+\b", s)) for s in sentences if len(s.strip()) > 10]
        length_variance = float(sum((l - (sum(lengths)/max(len(lengths),1)))**2 for l in lengths) / max(len(lengths), 1)) if lengths else 10.0
        
        all_words = re.findall(r"\b[a-zA-Z']+\b", text.lower())
        total_words = len(all_words)
        unique_words = len(set(all_words))
        overall_ttr = unique_words / max(total_words, 1)
        
        # Readability metrics via textstat
        flesch_reading_ease = 65.0
        flesch_kincaid_grade = 10.0
        try:
            import textstat
            flesch_reading_ease = textstat.flesch_reading_ease(text)
            flesch_kincaid_grade = textstat.flesch_kincaid_grade(text)
        except Exception:
            pass
            
        # Punctuation diversity
        punct_count = len(re.findall(r"[,;:\-\—\(\)]", text))
        punct_density = punct_count / max(total_words, 1)
        
        # High sentence length variance indicates human writing; low variance indicates AI
        # Human essays often have bursty sentence lengths (short punches mixed with complex clauses)
        length_var_score = 1.0 / (1.0 + math.exp(0.08 * (length_variance - 45.0))) # low variance -> high AI score
        
        combined_score = round(float(0.4 * length_var_score + 0.3 * (1.0 if overall_ttr > 0.65 else 0.3) + 0.3 * (1.0 if flesch_kincaid_grade > 11.5 else 0.4)), 4)
        
        return {
            "sentence_length_variance": round(length_variance, 2),
            "type_token_ratio": round(overall_ttr, 3),
            "flesch_reading_ease": round(flesch_reading_ease, 1),
            "flesch_kincaid_grade": round(flesch_kincaid_grade, 1),
            "punctuation_density": round(punct_density, 3),
            "score": min(max(combined_score, 0.05), 0.95),
            "feature_vector": [
                round(length_variance, 2),
                round(overall_ttr, 3),
                round(flesch_reading_ease, 1),
                round(flesch_kincaid_grade, 1),
                round(punct_density, 3)
            ]
        }
