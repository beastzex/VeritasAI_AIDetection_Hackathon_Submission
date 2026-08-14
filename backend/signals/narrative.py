import numpy as np
from typing import List, Dict, Any

class NarrativeSignal:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self._load_attempted = False
        
    def _get_model(self):
        if self.model is None and not self._load_attempted:
            self._load_attempted = True
            try:
                import torch
                from sentence_transformers import SentenceTransformer
                # Load on CPU with minimal memory footprint
                self.model = SentenceTransformer(self.model_name, device="cpu")
                print("Signal B: Loaded SentenceTransformer onto CPU.")
            except Exception as e:
                print(f"Notice: NarrativeSignal fallback to lightweight TF-IDF semantic embeddings: {e}")
                self.model = None
        return self.model

    def compute_trajectory(self, sentences: List[str]) -> Dict[str, Any]:
        """
        Computes cosine similarity trajectory between consecutive sentence embeddings
        and calculates variance across the essay.
        Low variance (uniform semantic drift) -> AI-like.
        High variance (narrative leaps, tangents) -> Human-like.
        """
        valid_sentences = [s.strip() for s in sentences if len(s.strip()) > 15]
        
        if len(valid_sentences) < 2:
            return {
                "variance": 0.04, # neutral baseline
                "mean_similarity": 0.60,
                "trajectory": [],
                "score": 0.50,
                "interpretation": "Insufficient sentence count for trajectory variance."
            }
            
        model = self._get_model()
        if model is not None:
            try:
                import torch
                with torch.no_grad():
                    embeddings = model.encode(valid_sentences, convert_to_tensor=True, show_progress_bar=False)
                    norms = torch.norm(embeddings, dim=1, keepdim=True)
                    norm_embeddings = embeddings / (norms + 1e-8)
                    
                    # Compute consecutive cosine similarities: dot product of normalized vectors
                    sims_tensor = (norm_embeddings[:-1] * norm_embeddings[1:]).sum(dim=1)
                    sims = sims_tensor.cpu().numpy().tolist()
            except Exception as e:
                print(f"Warning: Falling back to word-level semantic overlap: {e}")
                sims = self._compute_fallback_sims(valid_sentences)
        else:
            sims = self._compute_fallback_sims(valid_sentences)
            
        if not sims:
            return {"variance": 0.04, "mean_similarity": 0.60, "trajectory": [], "score": 0.50}
            
        sims_arr = np.array(sims)
        variance = float(np.var(sims_arr))
        mean_sim = float(np.mean(sims_arr))
        
        # Scoring logic:
        # High variance (e.g. > 0.015) -> Human
        # Low variance (e.g. < 0.005) -> AI
        # Score ranges from 0.0 (High variance = human) to 1.0 (Low variance = AI)
        ai_score = 1.0 - min(1.0, variance / 0.02)
        
        return {
            "variance": round(variance, 5),
            "mean_similarity": round(mean_sim, 3),
            "trajectory": [round(s, 3) for s in sims],
            "score": round(max(0.0, min(1.0, ai_score)), 3),
            "is_monotonic_ai": variance < 0.003
        }

    def _compute_fallback_sims(self, sentences: List[str]) -> List[float]:
        sims = []
        for i in range(len(sentences) - 1):
            set1 = set(sentences[i].lower().split())
            set2 = set(sentences[i+1].lower().split())
            union = len(set1.union(set2))
            sim = len(set1.intersection(set2)) / union if union > 0 else 0.5
            sims.append(sim)
        return sims
