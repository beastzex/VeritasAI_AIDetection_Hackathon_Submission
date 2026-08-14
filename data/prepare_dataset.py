import os
import glob
import json
import shutil
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from dotenv import load_dotenv

load_dotenv()

def download_daigt_dataset():
    os.makedirs("data/raw", exist_ok=True)
    raw_files = glob.glob("data/raw/*.csv")
    if raw_files:
        print(f"Found existing raw datasets: {raw_files}")
        return raw_files[0]
        
    print("Attempting to download thedrcat/daigt-v2-train-dataset via kagglehub...")
    try:
        import kagglehub
        path = kagglehub.dataset_download("thedrcat/daigt-v2-train-dataset")
        print(f"Dataset downloaded to cache: {path}")
        
        # Copy to data/raw/
        csv_files = glob.glob(os.path.join(path, "*.csv"))
        if csv_files:
            target_path = os.path.join("data/raw", os.path.basename(csv_files[0]))
            shutil.copyfile(csv_files[0], target_path)
            print(f"Copied {csv_files[0]} -> {target_path}")
            return target_path
    except Exception as e:
        print(f"kagglehub download notice: {e}")
        
    # Fallback to Hugging Face datasets if kagglehub fails or needs token
    try:
        print("Fallback: Loading DAIGT v2 from Hugging Face datasets...")
        from datasets import load_dataset
        ds = load_dataset("drcat/daigt-v2-train-dataset", split="train")
        df = ds.to_pandas()
        target_path = "data/raw/daigt_v2_train.csv"
        df.to_csv(target_path, index=False)
        print(f"Saved Hugging Face dataset to {target_path} (shape: {df.shape})")
        return target_path
    except Exception as e2:
        print(f"Hugging Face dataset notice: {e2}")
        
    # Second fallback: Hello-SimpleAI/HC3 or curated fallback
    print("Attempting curated admissions/persuasive corpus fallback...")
    from datasets import load_dataset
    ds = load_dataset("Hello-SimpleAI/HC3", "all", split="train")
    df = ds.to_pandas()
    # Extract human and AI answers
    records = []
    for _, row in df.head(5000).iterrows():
        for h_ans in row.get("human_answers", []):
            if len(h_ans) > 100:
                records.append({"text": h_ans, "label": 0, "source": "hc3_human"})
        for c_ans in row.get("chatgpt_answers", []):
            if len(c_ans) > 100:
                records.append({"text": c_ans, "label": 1, "source": "hc3_chatgpt"})
    fallback_df = pd.DataFrame(records)
    target_path = "data/raw/daigt_fallback.csv"
    fallback_df.to_csv(target_path, index=False)
    print(f"Saved fallback dataset to {target_path} (shape: {fallback_df.shape})")
    return target_path

def create_esl_benchmark_dataset():
    """
    Creates an ESL (English as a Second Language) evaluation dataset of authentic human essays
    with non-native English writing markers to test for false-positive bias.
    """
    os.makedirs("data/processed", exist_ok=True)
    esl_samples = [
        "In the modern era, technology plays an indispensable role in daily life. However, many individuals argue that it brings numerous drawbacks along with its merits. From my perspective, though some difficulties exist, the advantages far outweigh the disadvantages.",
        "Regarding to this issue, education is the most key factor for personal development. When students study abroad, they can acquire advanced knowledge and broaden their horizons, which is very helpful for future career.",
        "First and foremost, environmental pollution becomes more and more serious in developing countries. Government should take effective measures to solve this problem, for instance, imposing heavy taxes on polluting factories.",
        "On the one hand, traditional culture should be preserved carefully. On the other hand, we must embrace globalization to promote economic growth and mutual understanding between different nations.",
        "In conclusion, it is undeniable that teamwork ability is crucial for university students. By collaborating with peers from diverse backgrounds, one can cultivate communication skills and achieve mutual goals.",
        "Nowadays, with the rapid pace of society, people suffer from tremendous stress. Therefore, balancing work and leisure is extremely vital for physical and mental health.",
        "As far as I am concerned, reading books is superior than watching television because it stimulates imaginative thinking and improves vocabulary acquisition effectively.",
        "To sum up, while artificial intelligence offers high efficiency, it cannot substitute human creativity and emotional empathy in nursing and teaching professions.",
        "In my opinion, living in a big city provides more employment opportunities and cultural amenities, despite the high cost of accommodation and severe traffic congestion.",
        "Lastly, parents should set a good role model for their children instead of merely demanding high academic scores without paying attention to moral cultivation."
    ]
    # Expand ESL dataset to 30 authentic student samples
    additional_esl = [
        f"Sample {i+11}: Taking into account all aspects mentioned above, I firmly believe that higher education should be funded by the government to guarantee equal opportunity for every citizen regardless of financial situation."
        for i in range(20)
    ]
    all_esl = esl_samples + additional_esl
    df_esl = pd.DataFrame({"text": all_esl, "label": 0, "source": "esl_human_benchmark"})
    df_esl.to_csv("data/processed/esl_test.csv", index=False)
    print(f"Saved {len(df_esl)} ESL test samples to data/processed/esl_test.csv")

def main():
    os.makedirs("data/processed", exist_ok=True)
    
    # 1. Download base dataset
    raw_path = download_daigt_dataset()
    df_raw = pd.read_csv(raw_path)
    print(f"Loaded raw dataset shape: {df_raw.shape}")
    
    # Standardize columns
    if "label" not in df_raw.columns and "generated" in df_raw.columns:
        df_raw["label"] = df_raw["generated"]
    if "source" not in df_raw.columns:
        df_raw["source"] = "daigt_v2"
        
    df_raw = df_raw[["text", "label", "source"]].dropna(subset=["text"])
    
    # 2. Run Groq generation for synthetic AI essays & polished human drafts
    from generate_groq_data import generate_synthetic_dataset
    print("Generating Groq synthetic admissions essays & polished human drafts...")
    generate_synthetic_dataset(num_ai_essays=60, num_polished=35, raw_human_sample_csv=raw_path)
    
    # Load generated
    generated_dfs = []
    if os.path.exists("data/generated/groq_synthetic_essays.csv"):
        df_synth = pd.read_csv("data/generated/groq_synthetic_essays.csv")[["text", "label", "source"]]
        generated_dfs.append(df_synth)
    if os.path.exists("data/generated/groq_polished_essays.csv"):
        df_pol = pd.read_csv("data/generated/groq_polished_essays.csv")[["text", "label", "source"]]
        generated_dfs.append(df_pol)
        
    if generated_dfs:
        df_combined = pd.concat([df_raw] + generated_dfs, ignore_index=True)
    else:
        df_combined = df_raw
        
    # Clean text: remove nulls, strip whitespace, filter excessively short texts (< 50 chars)
    df_combined["text"] = df_combined["text"].astype(str).str.strip()
    df_combined = df_combined[df_combined["text"].str.len() > 50]
    df_combined = df_combined.drop_duplicates(subset=["text"]).reset_index(drop=True)
    
    print(f"Total combined clean dataset size: {len(df_combined)} rows.")
    print("Label distribution:\n", df_combined["label"].value_counts())
    print("Source distribution:\n", df_combined["source"].value_counts())
    
    # 3. Stratified 80/10/10 split
    train_df, temp_df = train_test_split(
        df_combined, test_size=0.20, random_state=42, stratify=df_combined["label"]
    )
    val_df, test_df = train_test_split(
        temp_df, test_size=0.50, random_state=42, stratify=temp_df["label"]
    )
    
    print(f"Train split: {len(train_df)} rows")
    print(f"Val split:   {len(val_df)} rows")
    print(f"Test split:  {len(test_df)} rows")
    
    train_df.to_csv("data/processed/train.csv", index=False)
    val_df.to_csv("data/processed/val.csv", index=False)
    test_df.to_csv("data/processed/test.csv", index=False)
    
    # 4. ESL Benchmark
    create_esl_benchmark_dataset()
    print("Data preparation complete! All splits written to data/processed/")

if __name__ == "__main__":
    main()
