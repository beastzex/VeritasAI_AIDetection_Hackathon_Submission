import os
import json
import re
import math
from typing import List, Dict, Any

class VocabularySignal:
    def __init__(self, signature_path: str = "backend/model_weights/signature_list.json"):
        self.signature_path = signature_path
        self.signature_dict: Dict[str, Dict[str, Any]] = {}
        self.loaded = False
        self._load_signatures()
        
    def _load_signatures(self):
        if os.path.exists(self.signature_path):
            try:
                with open(self.signature_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    sigs = data.get("signatures", [])
                    for s in sigs:
                        self.signature_dict[s["phrase"].lower()] = s
                self.loaded = True
            except Exception as e:
                print(f"Error loading signatures from {self.signature_path}: {e}")
        else:
            # Fallback default AI hallmark markers if file not yet generated
            default_phrases = [
                "in conclusion", "moreover", "furthermore", "delve into", "testament to",
                "tapestry of", "pivotal role", "beacon of hope", "foster a sense of",
                "multifaceted", "underscores the importance", "indelible mark", "crucial aspect",
                "vital role", "rich tapestry", "journey of self-discovery", "unwavering commitment",
                "transformative power", "profound impact", "valuable lessons", "realm of"
            ]
            for p in default_phrases:
                self.signature_dict[p] = {"phrase": p, "log_odds": 2.5, "z_score": 3.0, "direction": "ai"}
                
    def tokenize(self, text: str) -> List[str]:
        return re.findall(r"\b[a-z']+\b", text.lower())
        
    def extract_ngrams(self, tokens: List[str]) -> List[str]:
        unigrams = tokens
        bigrams = [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]
        return unigrams + bigrams

    def score_sentence(self, sentence: str) -> Dict[str, Any]:
        """
        Scores a single sentence based on AI vocabulary markers.
        Requires minimum density before considering it a strong signal.
        """
        tokens = self.tokenize(sentence)
        if not tokens:
            return {"score": 0.0, "density": 0.0, "matched_phrases": [], "flagged": False}
            
        ngrams = self.extract_ngrams(tokens)
        matched = []
        total_weight = 0.0
        
        for ng in ngrams:
            if ng in self.signature_dict:
                sig = self.signature_dict[ng]
                matched.append({
                    "phrase": ng,
                    "log_odds": sig.get("log_odds", 1.0),
                    "z_score": sig.get("z_score", 1.0)
                })
                total_weight += max(sig.get("z_score", 1.0), 0.5)
                
        num_tokens = max(len(tokens), 1)
        density = len(matched) / num_tokens
        
        # Minimum density requirement: at least 1 strong marker per 15 tokens or multiple markers
        if len(matched) >= 2 or (len(matched) == 1 and total_weight >= 3.0 and num_tokens <= 18):
            raw_score = total_weight / (math.sqrt(num_tokens) + 1.0)
            score = min(1.0 / (1.0 + math.exp(-1.5 * (raw_score - 1.2))), 1.0)
        else:
            score = min(total_weight * 0.05, 0.25)
            
        return {
            "score": round(float(score), 4),
            "density": round(float(density), 4),
            "matched_phrases": matched,
            "flagged": score >= 0.5
        }
        
    def score_essay(self, text: str) -> Dict[str, Any]:
        """Aggregated score across whole essay."""
        tokens = self.tokenize(text)
        if not tokens:
            return {"score": 0.0, "density": 0.0, "total_matches": 0, "matched_phrases": []}
            
        ngrams = self.extract_ngrams(tokens)
        matched = [self.signature_dict[ng] for ng in ngrams if ng in self.signature_dict]
        density = len(matched) / max(len(tokens), 1)
        raw_score = sum(m.get("z_score", 1.0) for m in matched) / (math.sqrt(len(tokens)) + 1.0)
        score = 1.0 / (1.0 + math.exp(-1.2 * (raw_score - 2.0)))
        
        return {
            "score": round(float(min(max(score, 0.0), 1.0)), 4),
            "density": round(float(density), 4),
            "total_matches": len(matched),
            "matched_phrases": matched[:15]
        }
