import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any
from tqdm import tqdm
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score, brier_score_loss

# Add project root to sys.path
sys.path.append(os.path.abspath("."))
sys.path.append(os.path.abspath("backend"))

from backend.signals.vocabulary import VocabularySignal
from backend.signals.narrative import NarrativeSignal
from backend.signals.stylometry import StylometrySignal
from backend.signals.classifier import ClassifierSignal

def extract_features_for_essay(
    text: str,
    vocab_sig: VocabularySignal,
    narrative_sig: NarrativeSignal,
    stylo_sig: StylometrySignal,
    clf_sig: ClassifierSignal
) -> List[float]:
    """
    Extracts the combined 8-dimensional feature vector:
    [
      Signal A: Vocab Score,
      Signal A: Vocab Density,
      Signal B: Narrative Variance Score,
      Signal C: Length Variance,
      Signal C: Type-Token Ratio,
      Signal C: Readability Ease,
      Signal C: Stylo Combined Score,
      Signal D: Classifier Probability
    ]
    """
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm", disable=["ner"])
        doc = nlp(text[:2500])
        sentences = [s.text.strip() for s in doc.sents if len(s.text.strip()) > 15]
    except Exception:
        sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 15]
        
    if not sentences:
        sentences = [text]
        
    # Signal A
    res_a = vocab_sig.score_essay(text)
    f_vocab_score = res_a["score"]
    f_vocab_density = res_a["density"]
    
    # Signal B
    res_b = narrative_sig.compute_trajectory(sentences)
    f_narrative_score = res_b["score"]
    
    # Signal C
    res_c = stylo_sig.compute_essay_stylometrics(text, sentences)
    f_len_var = res_c["sentence_length_variance"]
    f_ttr = res_c["type_token_ratio"]
    f_readability = res_c["flesch_reading_ease"]
    f_stylo_score = res_c["score"]
    
    # Signal D
    f_clf_prob = clf_sig.predict_single(text[:512])
    
    return [
        f_vocab_score,
        f_vocab_density,
        f_narrative_score,
        f_len_var / 100.0, # scaled
        f_ttr,
        f_readability / 100.0, # scaled
        f_stylo_score,
        f_clf_prob
    ]

FEATURE_NAMES = [
    "sig_a_vocab_score",
    "sig_a_vocab_density",
    "sig_b_narrative_variance_score",
    "sig_c_length_variance_scaled",
    "sig_c_type_token_ratio",
    "sig_c_readability_scaled",
    "sig_c_heuristic_score",
    "sig_d_deberta_prob"
]

def main():
    train_path = "data/processed/train.csv"
    val_path = "data/processed/val.csv"
    
    if not os.path.exists(train_path) or not os.path.exists(val_path):
        raise FileNotFoundError("Train/Val data not found. Run prepare_dataset.py first.")
        
    print("Loading datasets for combiner training...")
    df_train = pd.read_csv(train_path)
    df_val = pd.read_csv(val_path)
    
    sample_size_train = min(600, len(df_train))
    sample_size_val = min(150, len(df_val))
    
    df_train_sub = df_train.sample(sample_size_train, random_state=42).reset_index(drop=True)
    df_val_sub = df_val.sample(sample_size_val, random_state=42).reset_index(drop=True)
    
    print("Initializing analytical signal modules...")
    vocab_sig = VocabularySignal()
    narrative_sig = NarrativeSignal()
    stylo_sig = StylometrySignal()
    clf_sig = ClassifierSignal()
    
    print(f"Extracting multi-signal features on {sample_size_train} training samples...")
    X_train, y_train = [], []
    for _, row in tqdm(df_train_sub.iterrows(), total=len(df_train_sub), desc="Train Features"):
        feats = extract_features_for_essay(str(row["text"]), vocab_sig, narrative_sig, stylo_sig, clf_sig)
        X_train.append(feats)
        y_train.append(int(row["label"]))
        
    print(f"Extracting multi-signal features on {sample_size_val} validation samples...")
    X_val, y_val = [], []
    for _, row in tqdm(df_val_sub.iterrows(), total=len(df_val_sub), desc="Val Features"):
        feats = extract_features_for_essay(str(row["text"]), vocab_sig, narrative_sig, stylo_sig, clf_sig)
        X_val.append(feats)
        y_val.append(int(row["label"]))
        
    X_train = np.array(X_train)
    y_train = np.array(y_train)
    X_val = np.array(X_val)
    y_val = np.array(y_val)
    
    print("\nFitting Logistic Regression Combiner Model...")
    combiner = LogisticRegression(C=1.0, penalty="l2", max_iter=1000, random_state=42)
    combiner.fit(X_train, y_train)
    
    # Evaluate
    val_preds = combiner.predict(X_val)
    val_probs = combiner.predict_proba(X_val)[:, 1]
    
    auc = roc_auc_score(y_val, val_probs)
    brier = brier_score_loss(y_val, val_probs)
    
    print("\n=======================================================")
    print("           COMBINER MODEL TRAINING REPORT             ")
    print("=======================================================")
    print(f"Validation ROC-AUC:    {auc:.4f}")
    print(f"Validation Brier Loss: {brier:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_val, val_preds, target_names=["Human", "AI"]))
    
    print("\n--- Learned Feature Weights / Coefficients Defense ---")
    coefs = combiner.coef_[0]
    intercept = combiner.intercept_[0]
    coef_dict = {}
    for name, weight in zip(FEATURE_NAMES, coefs):
        coef_dict[name] = round(float(weight), 4)
        print(f"  {name:32s} : {weight:+.4f}")
    print(f"  {'Intercept':32s} : {intercept:+.4f}")
    print("=======================================================\n")
    
    os.makedirs("backend/model_weights", exist_ok=True)
    model_save_path = "backend/model_weights/combiner_model.pkl"
    joblib.dump({
        "model": combiner,
        "feature_names": FEATURE_NAMES,
        "coefficients": coef_dict,
        "intercept": float(intercept),
        "val_roc_auc": float(auc),
        "val_brier_loss": float(brier)
    }, model_save_path)
    
    print(f"Saved combiner model artifact to {model_save_path}")

if __name__ == "__main__":
    main()
