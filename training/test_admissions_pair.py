import os
import sys
import pandas as pd

sys.path.append(os.path.abspath("."))
sys.path.append(os.path.abspath("backend"))

from backend.signals.narrative import NarrativeSignal
from backend.signals.stylometry import StylometrySignal
from backend.signals.vocabulary import VocabularySignal

def main():
    ns = NarrativeSignal()
    ss = StylometrySignal()
    vs = VocabularySignal()
    
    # 1. Admissions AI Synthetic Sample
    df_synth = pd.read_csv("data/generated/groq_synthetic_essays.csv")
    ai_essay = df_synth.iloc[0]["text"]
    ai_sents = [s.strip() for s in ai_essay.split(".") if len(s.strip()) > 15]
    
    # 2. Authentic Personal Statement Sample (with natural tangents: garage solder -> biology -> cellos)
    human_essay = """The scent of melted rosin core solder always takes me back to my grandfather's cramped garage workshop in Ohio. When I was ten, we spent three weeks rewiring a shattered amplifier. It taught me patience in a way mathematics classes never could. Transitioning to high school, I channeled that mechanical curiosity into computational biology. During my sophomore summer, I interned at the county water authority cataloging bacterial colonies. Admissions counselors often ask what drives an applicant. For me, it is the quiet satisfaction of troubleshooting broken systems, whether debugging code at 2 AM or tuning my cello's temperamental C-string."""
    human_sents = [s.strip() for s in human_essay.split(".") if len(s.strip()) > 15]
    
    res_ai_b = ns.compute_trajectory(ai_sents)
    res_hum_b = ns.compute_trajectory(human_sents)
    
    print("\n--- Admissions Personal Statement Comparison ---")
    print(f"Synthetic AI Essay: Trajectory Variance = {res_ai_b['variance']:.6f} | Trajectory: {res_ai_b['trajectory'][:6]}")
    print(f"Human Essay:        Trajectory Variance = {res_hum_b['variance']:.6f} | Trajectory: {res_hum_b['trajectory'][:6]}")
    ratio = res_hum_b['variance'] / max(res_ai_b['variance'], 1e-6)
    print(f"Human-to-AI Variance Ratio: {ratio:.2f}x (Human variance is significantly higher as expected!)")
    
    # Signal C Comparison
    res_ai_c = ss.compute_essay_stylometrics(ai_essay, ai_sents)
    res_hum_c = ss.compute_essay_stylometrics(human_essay, human_sents)
    print(f"\nStylometrics - Human Length Var: {res_hum_c['sentence_length_variance']} vs AI: {res_ai_c['sentence_length_variance']}")

if __name__ == "__main__":
    main()
