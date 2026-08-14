import os
import re
import torch
import numpy as np
import pandas as pd
from typing import Dict, List
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding
)
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, roc_auc_score

# Ensure deterministic execution
torch.manual_seed(42)
np.random.seed(42)

# Using roberta-base (as explicitly sanctioned fallback in the master brief) for maximum PyTorch 2.6 stability
MODEL_NAME = "roberta-base"
OUTPUT_DIR = "backend/model_weights/deberta_essay_classifier"

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    probs = torch.softmax(torch.tensor(logits), dim=-1)[:, 1].numpy()
    preds = np.argmax(logits, axis=-1)
    
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average="binary", zero_division=0)
    acc = accuracy_score(labels, preds)
    try:
        auc = roc_auc_score(labels, probs)
    except:
        auc = 0.5
        
    return {
        "accuracy": acc,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "roc_auc": auc
    }

def split_into_sentences_fast(text: str) -> List[str]:
    """Fast regex sentence boundary tokenizer."""
    sents = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sents if len(s.strip()) > 25]

def prepare_sentence_level_dataset(df: pd.DataFrame, max_samples: int = 3500) -> Dataset:
    """
    Constructs high-quality sentence-level training pairs from essays.
    """
    records = []
    if len(df) > max_samples:
        df = df.sample(max_samples, random_state=42).reset_index(drop=True)
        
    for _, row in df.iterrows():
        text = str(row["text"]).strip()
        label = int(row["label"])
        sentences = split_into_sentences_fast(text[:1800])
        
        # Take up to 3 representative sentences per essay
        for sent in sentences[:3]:
            records.append({"text": sent, "label": label})
            
    df_sent = pd.DataFrame(records).drop_duplicates(subset=["text"]).reset_index(drop=True)
    print(f"Prepared {len(df_sent)} sentence samples (Distribution: {dict(df_sent['label'].value_counts())})")
    return Dataset.from_pandas(df_sent)

def main():
    train_path = "data/processed/train.csv"
    val_path = "data/processed/val.csv"
    
    if not os.path.exists(train_path) or not os.path.exists(val_path):
        raise FileNotFoundError("Processed train/val files not found. Run prepare_dataset.py first.")
        
    print(f"Loading data from {train_path} and {val_path}...")
    df_train = pd.read_csv(train_path)
    df_val = pd.read_csv(val_path)
    
    print("Building sentence-level training datasets...")
    raw_train_ds = prepare_sentence_level_dataset(df_train, max_samples=3000)
    raw_val_ds = prepare_sentence_level_dataset(df_val, max_samples=500)
    
    print(f"Loading tokenizer & model: {MODEL_NAME}...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            
    def tokenize_func(examples):
        return tokenizer(examples["text"], truncation=True, max_length=256)
        
    print("Tokenizing datasets...")
    train_tokenized = raw_train_ds.map(tokenize_func, batched=True)
    val_tokenized = raw_val_ds.map(tokenize_func, batched=True)
    
    print(f"Initializing {MODEL_NAME} for binary classification...")
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=2,
        id2label={0: "Human", 1: "AI"},
        label2id={"Human": 0, "AI": 1}
    )
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    use_fp16 = torch.cuda.is_available()
    print(f"Training on device: {device} | Mixed precision fp16: {use_fp16}")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Exact hyperparameters from Master Brief
    training_args = TrainingArguments(
        output_dir="./checkpoints",
        per_device_train_batch_size=4,        # 6GB VRAM budget
        per_device_eval_batch_size=8,
        gradient_accumulation_steps=4,        # simulates batch size 16
        fp16=use_fp16,                        # mixed precision
        gradient_checkpointing=True if torch.cuda.is_available() else False,
        num_train_epochs=3,
        learning_rate=2e-5,
        weight_decay=0.01,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        save_total_limit=1,
        logging_steps=50,
        report_to="none"
    )
    
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_tokenized,
        eval_dataset=val_tokenized,
        processing_class=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics
    )
    
    print("\nStarting Transformer fine-tuning on GPU...")
    train_result = trainer.train()
    print("Training finished!")
    
    print(f"Saving fine-tuned model and tokenizer to {OUTPUT_DIR}...")
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    print("\nRunning final validation evaluation...")
    eval_metrics = trainer.evaluate()
    print("Validation Metrics:")
    for k, v in eval_metrics.items():
        print(f"  {k}: {v:.4f}" if isinstance(v, float) else f"  {k}: {v}")
        
    print(f"Model saved successfully to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
