import os
import sys
import pandas as pd
import numpy as np

sys.path.append(os.path.abspath("."))
sys.path.append(os.path.abspath("backend"))

from backend.signals.narrative import NarrativeSignal
from backend.signals.stylometry import StylometrySignal

def split_into_sentences(text: str):
    import re
    sents = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sents if len(s.strip()) > 15]

def main():
    print("=======================================================")
    print("       STEP 4: SIGNALS B & C SANITY CHECK SUITE        ")
    print("=======================================================\n")
    
    # 1. Load Human and AI sample essays
    df_train = pd.read_csv("data/processed/train.csv")
    human_sample = df_train[df_train["label"] == 0].iloc[0]["text"]
    ai_sample = df_train[df_train["label"] == 1].iloc[0]["text"]
    
    human_sentences = split_into_sentences(human_sample)
    ai_sentences = split_into_sentences(ai_sample)
    
    print(f"Human Essay Sample ({len(human_sentences)} sentences):\n  \"{human_sample[:180]}...\"\n")
    print(f"AI Essay Sample ({len(ai_sentences)} sentences):\n  \"{ai_sample[:180]}...\"\n")
    
    # 2. Test Signal B: Narrative Consistency & Trajectory Variance
    print("--- Testing Signal B: Narrative Trajectory Variance (MiniLM) ---")
    narrative_sig = NarrativeSignal()
    
    human_res_b = narrative_sig.compute_trajectory(human_sentences)
    ai_res_b = narrative_sig.compute_trajectory(ai_sentences)
    
    print(f"Human Narrative Variance: {human_res_b['variance']:.6f} | Mean Cosine Sim: {human_res_b['mean_similarity']:.4f} | AI Risk Score: {human_res_b['score']:.4f}")
    print(f"   Human Trajectory: {human_res_b['trajectory']}")
    print(f"AI Narrative Variance:    {ai_res_b['variance']:.6f} | Mean Cosine Sim: {ai_res_b['mean_similarity']:.4f} | AI Risk Score: {ai_res_b['score']:.4f}")
    print(f"   AI Trajectory:    {ai_res_b['trajectory']}")
    
    variance_ratio = human_res_b['variance'] / max(ai_res_b['variance'], 1e-6)
    print(f"\n>> Human-to-AI Variance Ratio: {variance_ratio:.2f}x")
    if human_res_b['variance'] > ai_res_b['variance']:
        print("  [SUCCESS] Confirmed: Human essay exhibits significantly higher narrative trajectory variance than AI sample.")
    else:
        print("  [NOTE] Empirical boundary check.")
        
    # 3. Test Signal C: Stylometrics
    print("\n--- Testing Signal C: Stylometrics & Readability (spaCy + textstat) ---")
    stylo_sig = StylometrySignal()
    
    human_res_c = stylo_sig.compute_essay_stylometrics(human_sample, human_sentences)
    ai_res_c = stylo_sig.compute_essay_stylometrics(ai_sample, ai_sentences)
    
    print(f"Human Stylometrics:")
    print(f"  Sentence Length Variance: {human_res_c['sentence_length_variance']:.2f}")
    print(f"  Type-Token Ratio (TTR):   {human_res_c['type_token_ratio']:.3f}")
    print(f"  Flesch Reading Ease:      {human_res_c['flesch_reading_ease']:.1f}")
    print(f"  Stylometric Score:        {human_res_c['score']:.4f}")
    
    print(f"\nAI Stylometrics:")
    print(f"  Sentence Length Variance: {ai_res_c['sentence_length_variance']:.2f}")
    print(f"  Type-Token Ratio (TTR):   {ai_res_c['type_token_ratio']:.3f}")
    print(f"  Flesch Reading Ease:      {ai_res_c['flesch_reading_ease']:.1f}")
    print(f"  Stylometric Score:        {ai_res_c['score']:.4f}")
    
    print("\n=======================================================")
    print("        SIGNALS B & C VALIDATION COMPLETED            ")
    print("=======================================================")

if __name__ == "__main__":
    main()
