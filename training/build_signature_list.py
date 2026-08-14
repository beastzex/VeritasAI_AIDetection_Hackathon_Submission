import os
import json
import math
import re
import pandas as pd
import numpy as np
from collections import Counter
from typing import Dict, List, Tuple

def tokenize_text(text: str) -> List[str]:
    """Lowercase and extract alphanumeric word tokens."""
    return re.findall(r"\b[a-z']+\b", text.lower())

def extract_ngrams(tokens: List[str]) -> List[str]:
    """Extract unigrams and bigrams."""
    unigrams = tokens
    bigrams = [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]
    return unigrams + bigrams

def compute_log_odds_dirichlet(df_train: pd.DataFrame, min_freq: int = 5, top_k: int = 500) -> List[Dict]:
    """
    Computes Monroe et al. (2008) Log-Odds Ratio with Informative Dirichlet Prior
    comparing AI-generated text (Class 1) vs Human-written text (Class 0).
    """
    human_texts = df_train[df_train["label"] == 0]["text"].tolist()
    ai_texts = df_train[df_train["label"] == 1]["text"].tolist()
    
    print(f"Counting n-grams across {len(human_texts)} human texts and {len(ai_texts)} AI texts...")
    
    human_counts = Counter()
    ai_counts = Counter()
    background_counts = Counter()
    
    for text in human_texts:
        tokens = tokenize_text(text)
        ngrams = extract_ngrams(tokens)
        human_counts.update(ngrams)
        background_counts.update(ngrams)
        
    for text in ai_texts:
        tokens = tokenize_text(text)
        ngrams = extract_ngrams(tokens)
        ai_counts.update(ngrams)
        background_counts.update(ngrams)
        
    n_human = sum(human_counts.values())
    n_ai = sum(ai_counts.values())
    n_prior = sum(background_counts.values())
    
    print(f"Total tokens - Human: {n_human:,} | AI: {n_ai:,} | Vocabulary size: {len(background_counts):,}")
    
    # Target vocabulary: frequency >= min_freq across the combined corpus
    vocab = [w for w, c in background_counts.items() if c >= min_freq]
    print(f"Filtered vocabulary (min_freq >= {min_freq}): {len(vocab):,} n-grams.")
    
    # Prior scaling factor
    prior_scale = 0.1
    
    results = []
    for w in vocab:
        y_ai = ai_counts.get(w, 0)
        y_human = human_counts.get(w, 0)
        alpha_w = max(background_counts.get(w, 0) * (prior_scale / n_prior) * 1000, 0.01)
        alpha_0 = prior_scale * 1000
        
        # Dirichlet log-odds calculation
        log_odds_ai = math.log((y_ai + alpha_w) / (n_ai + alpha_0 - (y_ai + alpha_w)))
        log_odds_human = math.log((y_human + alpha_w) / (n_human + alpha_0 - (y_human + alpha_w)))
        
        delta = log_odds_ai - log_odds_human
        variance = (1.0 / (y_ai + alpha_w)) + (1.0 / (y_human + alpha_w))
        z_score = delta / math.sqrt(variance)
        
        results.append({
            "phrase": w,
            "log_odds": round(delta, 4),
            "z_score": round(z_score, 4),
            "ai_freq": y_ai,
            "human_freq": y_human,
            "direction": "ai" if delta > 0 else "human"
        })
        
    # Sort by positive z-score / log_odds for AI-skewed markers
    ai_skewed = [r for r in results if r["direction"] == "ai"]
    ai_skewed.sort(key=lambda x: x["z_score"], reverse=True)
    top_ai_signatures = ai_skewed[:top_k]
    
    print(f"\n--- Top 15 AI Signature Markers ---")
    for item in top_ai_signatures[:15]:
        print(f"  '{item['phrase']}': z-score={item['z_score']}, log-odds={item['log_odds']} (AI: {item['ai_freq']}, Human: {item['human_freq']})")
        
    return top_ai_signatures

def main():
    train_path = "data/processed/train.csv"
    if not os.path.exists(train_path):
        raise FileNotFoundError(f"{train_path} not found. Run prepare_dataset.py first.")
        
    df_train = pd.read_csv(train_path)
    signatures = compute_log_odds_dirichlet(df_train, min_freq=5, top_k=500)
    
    os.makedirs("backend/model_weights", exist_ok=True)
    out_path = "backend/model_weights/signature_list.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "num_signatures": len(signatures),
            "top_k": 500,
            "signatures": signatures
        }, f, indent=2)
        
    print(f"\nSaved {len(signatures)} AI vocabulary signatures to {out_path}")

if __name__ == "__main__":
    main()
