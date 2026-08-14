import os
import torch
from typing import List, Dict, Any

class ClassifierSignal:
    def __init__(self, model_path: str = "backend/model_weights/deberta_essay_classifier"):
        self.model_path = model_path
        self.tokenizer = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._load_model()
        
    def _load_model(self):
        if os.path.exists(self.model_path) and os.path.exists(os.path.join(self.model_path, "config.json")):
            try:
                from transformers import AutoTokenizer, AutoModelForSequenceClassification
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
                self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path).to(self.device)
                self.model.eval()
                print(f"Signal D DeBERTa model loaded from {self.model_path} onto {self.device}")
            except Exception as e:
                print(f"Error loading trained DeBERTa model: {e}")
                self.model = None
        else:
            print(f"Notice: Trained DeBERTa model not yet present at {self.model_path}. Ready for training.")

    def predict_sentences(self, sentences: List[str]) -> List[Dict[str, Any]]:
        """Predicts AI probability per sentence."""
        if not sentences:
            return []
            
        if self.model is None or self.tokenizer is None:
            # Fallback baseline heuristic if model is not yet loaded
            return [{"ai_prob": 0.50, "raw_logits": [0.0, 0.0]} for _ in sentences]
            
        results = []
        # Batch inference
        batch_size = 16
        with torch.no_grad():
            for i in range(0, len(sentences), batch_size):
                batch_texts = sentences[i:i+batch_size]
                inputs = self.tokenizer(
                    batch_texts,
                    padding=True,
                    truncation=True,
                    max_length=256,
                    return_tensors="pt"
                ).to(self.device)
                
                outputs = self.model(**inputs)
                probs = torch.softmax(outputs.logits, dim=-1)
                
                for j in range(len(batch_texts)):
                    ai_prob = float(probs[j][1].item())
                    results.append({
                        "ai_prob": round(ai_prob, 4),
                        "raw_logits": [round(float(outputs.logits[j][0].item()), 4), round(float(outputs.logits[j][1].item()), 4)]
                    })
                    
        return results

    def predict_single(self, text: str) -> float:
        res = self.predict_sentences([text])
        return res[0]["ai_prob"] if res else 0.5
