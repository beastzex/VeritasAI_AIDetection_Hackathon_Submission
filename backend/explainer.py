import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class ExplainerService:
    def __init__(self):
        self.api_key = os.environ.get("GROQ_API_KEY") or os.environ.get("Groq_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"Notice: Groq client init notice: {e}")

    def generate_explanation(self, sentence_data: Dict[str, Any], essay_context: str = "") -> str:
        """
        Translates pre-computed mathematical signals into a transparent, plain-English summary.
        IMPORTANT: The LLM does NOT decide whether text is AI or Human. It only narrates
        the already-computed metrics.
        """
        sentence_text = sentence_data.get("sentence", "")
        ai_prob = sentence_data.get("ai_probability", 0.5)
        band = sentence_data.get("band_label", "Uncertain")
        sig_a = sentence_data.get("signals", {}).get("signal_a_vocabulary", {})
        sig_b = sentence_data.get("signals", {}).get("signal_b_narrative", {})
        sig_c = sentence_data.get("signals", {}).get("signal_c_stylometry", {})
        sig_d = sentence_data.get("signals", {}).get("signal_d_classifier", {})
        
        matched_phrases = [m.get("phrase") for m in sig_a.get("matched_phrases", [])]
        phrases_str = ", ".join([f"'{p}'" for p in matched_phrases]) if matched_phrases else "None"
        
        # Rule-based fallback explanation
        reasons = []
        if matched_phrases:
            reasons.append(f"contains hallmark statistical vocabulary phrases ({phrases_str}) with strong log-odds skew")
        if sig_b.get("score", 0) > 0.6:
            reasons.append("exhibits uniform narrative drift with low local semantic variation")
        if sig_c.get("transition_count", 0) >= 1:
            reasons.append(f"utilizes formulaic discourse transitions (count: {sig_c.get('transition_count')})")
        if sig_c.get("passive_voice", False):
            reasons.append("employs passive voice construction common in synthetic text")
        if sig_d.get("ai_prob", 0) > 0.65:
            reasons.append(f"activated high DeBERTa sentence-level attention score ({sig_d.get('ai_prob'):.2%})")
            
        fallback_explanation = (
            f"This sentence is classified as **{band}** ({ai_prob:.1%} confidence). "
            + ("Key contributing factors: " + "; ".join(reasons) + "." if reasons else "It aligns with natural human sentence structure and vocabulary diversity.")
        )
        
        if not self.client:
            return fallback_explanation
            
        try:
            prompt = f"""
You are an analytical assistant for an AI Admissions Essay Detector.
The verdict and signal values have ALREADY been computed deterministically by our 4 analytical signals:
- Target Sentence: "{sentence_text}"
- Computed Verdict: {band} ({ai_prob:.1%} AI likelihood)
- Signal A (Vocabulary Signature Matches): {phrases_str} (Density: {sig_a.get('density', 0)})
- Signal B (Narrative Consistency Score): {sig_b.get('score', 0):.2f} (Trajectory stability)
- Signal C (Stylometrics): Transitions: {sig_c.get('transition_count', 0)}, Passive voice: {sig_c.get('passive_voice', False)}, Type-Token Ratio: {sig_c.get('ttr', 0)}
- Signal D (Fine-Tuned DeBERTa Score): {sig_d.get('ai_prob', 0):.2%}

Write a 2-3 sentence, highly concise, objective, transparent explanation of WHY the four signals produced this specific verdict.
DO NOT re-evaluate or question the verdict. Strictly narrate the mathematical evidence provided.
"""
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Notice: Groq explanation fallback triggered: {e}")
            return fallback_explanation
