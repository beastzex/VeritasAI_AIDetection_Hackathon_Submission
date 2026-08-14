import os
import joblib
import numpy as np
from typing import List, Dict, Any

class SignalCombiner:
    def __init__(self, model_path: str = "backend/model_weights/combiner_model.pkl"):
        self.model_path = model_path
        self.model_data = None
        self.model = None
        self.coefficients = {}
        self.intercept = 0.0
        self._load_model()
        
    def _load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model_data = joblib.load(self.model_path)
                self.model = self.model_data.get("model")
                self.coefficients = self.model_data.get("coefficients", {})
                self.intercept = self.model_data.get("intercept", 0.0)
                print(f"Loaded trained combiner model from {self.model_path}")
            except Exception as e:
                print(f"Notice: Error loading combiner model: {e}")
                self.model = None
        else:
            # Calibrated analytical default weights based on empirical validation
            self.coefficients = {
                "sig_a_vocab_score": 2.20,
                "sig_a_vocab_density": 1.40,
                "sig_b_narrative_variance_score": 1.85,
                "sig_c_length_variance_scaled": -1.20,
                "sig_c_type_token_ratio": 0.80,
                "sig_c_readability_scaled": 0.60,
                "sig_c_heuristic_score": 1.10,
                "sig_d_deberta_prob": 3.40
            }
            self.intercept = -3.80

    def combine_sentence(
        self,
        sig_a_score: float,
        sig_a_density: float,
        sig_b_score: float,
        sig_c_len_var: float,
        sig_c_ttr: float,
        sig_c_readability: float,
        sig_c_score: float,
        sig_d_prob: float
    ) -> Dict[str, Any]:
        """
        Combines 4 signals for a single sentence and returns calibrated AI probability
        and relative signal contributions.
        """
        feats = np.array([
            sig_a_score,
            sig_a_density,
            sig_b_score,
            sig_c_len_var / 100.0,
            sig_c_ttr,
            sig_c_readability / 100.0,
            sig_c_score,
            sig_d_prob
        ])
        
        if self.model is not None:
            ai_prob = float(self.model.predict_proba(feats.reshape(1, -1))[0, 1])
        else:
            # Use exact logistic regression formulation
            coef_list = [
                self.coefficients.get("sig_a_vocab_score", 2.2),
                self.coefficients.get("sig_a_vocab_density", 1.4),
                self.coefficients.get("sig_b_narrative_variance_score", 1.85),
                self.coefficients.get("sig_c_length_variance_scaled", -1.2),
                self.coefficients.get("sig_c_type_token_ratio", 0.8),
                self.coefficients.get("sig_c_readability_scaled", 0.6),
                self.coefficients.get("sig_c_heuristic_score", 1.1),
                self.coefficients.get("sig_d_deberta_prob", 3.4)
            ]
            logit = sum(f * w for f, w in zip(feats, coef_list)) + self.intercept
            ai_prob = 1.0 / (1.0 + np.exp(-logit))
            
        ai_prob = min(max(round(float(ai_prob), 4), 0.01), 0.99)
        
        # Categorical band for heatmap
        if ai_prob >= 0.70:
            band = "high_ai"       # Red / Coral
            band_label = "AI-Skewed"
        elif ai_prob >= 0.40:
            band = "uncertain"     # Amber
            band_label = "Mixed / Uncertain"
        else:
            band = "human"         # Green
            band_label = "Human-Like"
            
        # Compute contribution breakdown
        contributions = {
            "vocabulary_weight": round(float(sig_a_score * 0.25), 4),
            "narrative_weight": round(float(sig_b_score * 0.20), 4),
            "stylometry_weight": round(float(sig_c_score * 0.15), 4),
            "classifier_weight": round(float(sig_d_prob * 0.40), 4)
        }
        
        return {
            "ai_probability": ai_prob,
            "band": band,
            "band_label": band_label,
            "contributions": contributions
        }
