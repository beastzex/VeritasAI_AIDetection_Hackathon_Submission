import re
import math
from typing import Dict, Any, List

class StylometrySignal:
    def __init__(self):
        self.nlp = None
        
    def _get_nlp(self):
        if self.nlp is None:
            try:
                import spacy
                # Load lightweight spacy disabling heavy parser/ner pipelines
                self.nlp = spacy.load("en_core_web_sm", disable=["ner"])
            except Exception as e:
                print(f"Notice: spaCy deferred load: {e}")
                self.nlp = None
        return self.nlp

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
        nlp = self._get_nlp()
        if nlp:
            try:
                doc = nlp(sentence)
                for i in range(len(doc) - 1):
                    if doc[i].tag_ in ["VBD", "VBN", "VBZ", "VBP", "VBG", "VB"] and doc[i].lemma_ == "be":
                        if doc[i+1].tag_ == "VBN":
                            has_passive = True
                            break
            except Exception:
                has_passive = bool(re.search(r"\b(is|was|were|been|being|are|be)\s+\w+ed\b", sent_lower))
        else:
            has_passive = bool(re.search(r"\b(is|was|were|been|being|are|be)\s+\w+ed\b", sent_lower))
            
        # Stylometric heuristic scoring
        stylo_score = 0.5
        if transition_count >= 1:
            stylo_score += 0.20
        if ttr < 0.65 and num_words > 12:
            stylo_score += 0.15
        elif ttr > 0.85 and num_words > 12:
            stylo_score -= 0.15
            
        return {
            "word_count": num_words,
            "ttr": round(ttr, 3),
            "transition_count": transition_count,
            "passive_voice": has_passive,
            "score": round(max(0.0, min(1.0, stylo_score)), 3)
        }

    def compute_essay_stylometrics(self, sentences: List[str], full_text: str) -> Dict[str, Any]:
        """Calculates macro-level stylometric indicators across the whole essay."""
        if not sentences:
            return {"length_variance": 0.0, "avg_word_length": 0.0, "ttr": 0.0, "readability": 50.0}
            
        lengths = [len(re.findall(r"\b\w+\b", s)) for s in sentences if len(s.strip()) > 5]
        if not lengths:
            lengths = [10]
            
        mean_len = sum(lengths) / len(lengths)
        len_variance = sum((l - mean_len) ** 2 for l in lengths) / len(lengths)
        
        words = re.findall(r"\b[a-zA-Z]+\b", full_text)
        total_words = max(len(words), 1)
        unique_words = len(set(w.lower() for w in words))
        macro_ttr = unique_words / total_words
        avg_word_len = sum(len(w) for w in words) / total_words
        
        # Readability metrics
        try:
            import textstat
            flesch = textstat.flesch_reading_ease(full_text)
            fk_grade = textstat.flesch_kincaid_grade(full_text)
        except Exception:
            flesch = 60.0
            fk_grade = 10.0
            
        # Length variance: High variance = human burstiness; Low variance = monotonic AI
        burstiness_score = 1.0 - min(1.0, len_variance / 80.0)
        
        return {
            "sentence_length_variance": round(len_variance, 2),
            "mean_sentence_length": round(mean_len, 1),
            "macro_ttr": round(macro_ttr, 3),
            "avg_word_length": round(avg_word_len, 2),
            "flesch_reading_ease": round(flesch, 1),
            "flesch_kincaid_grade": round(fk_grade, 1),
            "burstiness_ai_score": round(burstiness_score, 3)
        }
