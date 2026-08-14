import os
import time
import json
import random
import pandas as pd
from dotenv import load_dotenv
from groq import Groq
from tqdm import tqdm

load_dotenv()
api_key = os.environ.get("GROQ_API_KEY") or os.environ.get("Groq_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment or .env file.")

client = Groq(api_key=api_key)

# We will use llama-3.3-70b-versatile or llama-3.1-8b-instant on Groq
MODEL_NAME = "llama-3.3-70b-versatile"

PROMPTS = [
    "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, please share your story.",
    "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
    "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
    "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
    "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
    "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
    "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design."
]

PERSONAS = [
    "A passionate aspiring bioengineer who founded a high school robotics club and loves synthetic biology.",
    "A first-generation college applicant from a rural town who helped run their family's local grocery store.",
    "A classical pianist and programmer exploring the intersection of algorithmic composition and human emotion.",
    "A community organizer who mobilized youth in their city around environmental sustainability and urban gardening.",
    "An immigrant student navigating bilingualism, cultural identity, and a love for investigative journalism.",
    "A debate captain fascinated by philosophy, ethics, and cognitive science.",
    "A self-taught computer programmer who developed accessible mobile tools for visually impaired peers."
]

def generate_ai_essay(prompt: str, persona: str) -> str:
    system_prompt = (
        "You are an AI assistant writing a high-scoring college admissions personal statement essay (approx 350-550 words). "
        "Adopt the persona provided and write a vivid, reflective, compelling essay adhering strictly to standard admissions essay conventions."
    )
    user_content = f"Persona: {persona}\nAdmissions Prompt: {prompt}\nWrite the personal statement essay:"
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        temperature=0.7,
        max_tokens=900
    )
    return response.choices[0].message.content.strip()

def polish_human_essay(human_text: str) -> str:
    system_prompt = (
        "You are an expert admissions essay editor and writing consultant. "
        "Take the following student-written essay draft and polish it. Improve transitions, elevate diction, "
        "smooth out sentence flow, enhance vocabulary, and make the essay sound cohesive, eloquent, and sophisticated "
        "while maintaining the core student narrative."
    )
    user_content = f"Original Student Draft:\n{human_text}\n\nPolished Version:"
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        temperature=0.5,
        max_tokens=900
    )
    return response.choices[0].message.content.strip()

def generate_synthetic_dataset(num_ai_essays=60, num_polished=35, raw_human_sample_csv=None):
    os.makedirs("data/generated", exist_ok=True)
    generated_records = []
    
    print(f"Generating {num_ai_essays} synthetic AI admissions essays via Groq ({MODEL_NAME})...")
    for i in tqdm(range(num_ai_essays), desc="AI Essays"):
        prompt = random.choice(PROMPTS)
        persona = random.choice(PERSONAS)
        try:
            essay_text = generate_ai_essay(prompt, persona)
            generated_records.append({
                "text": essay_text,
                "label": 1,
                "source": "groq_synthetic_ai",
                "prompt": prompt
            })
            time.sleep(0.4) # Rate limit safety
        except Exception as e:
            print(f"Error on iteration {i}: {e}")
            time.sleep(2)
            
    df_ai = pd.DataFrame(generated_records)
    df_ai.to_csv("data/generated/groq_synthetic_essays.csv", index=False)
    print(f"Saved {len(df_ai)} synthetic AI essays to data/generated/groq_synthetic_essays.csv")
    
    # Polishing Human drafts
    polished_records = []
    if raw_human_sample_csv and os.path.exists(raw_human_sample_csv):
        print(f"Generating {num_polished} AI-polished human drafts from {raw_human_sample_csv}...")
        df_raw = pd.read_csv(raw_human_sample_csv)
        human_subset = df_raw[df_raw["label"] == 0].dropna(subset=["text"]).sample(min(num_polished, len(df_raw)), random_state=42)
        
        for idx, row in tqdm(human_subset.iterrows(), total=len(human_subset), desc="Polishing Drafts"):
            orig_text = row["text"][:1500] # reasonable chunk
            try:
                polished_text = polish_human_essay(orig_text)
                polished_records.append({
                    "text": polished_text,
                    "label": 1,
                    "source": "groq_polished_human_draft",
                    "orig_text": orig_text
                })
                time.sleep(0.4)
            except Exception as e:
                print(f"Error polishing draft {idx}: {e}")
                time.sleep(2)
                
        df_pol = pd.DataFrame(polished_records)
        df_pol.to_csv("data/generated/groq_polished_essays.csv", index=False)
        print(f"Saved {len(df_pol)} AI-polished drafts to data/generated/groq_polished_essays.csv")
    else:
        print("Note: Raw human sample CSV not provided or found yet; polished generation will run after downloading DAIGT V2.")

if __name__ == "__main__":
    generate_synthetic_dataset(num_ai_essays=60, num_polished=35)
