import os
import shutil
from transformers import AutoTokenizer, AutoModelForSequenceClassification

src_dir = "checkpoints/checkpoint-554"
dst_dir = "backend/model_weights/deberta_essay_classifier"

os.makedirs(dst_dir, exist_ok=True)
for item in os.listdir(src_dir):
    s = os.path.join(src_dir, item)
    d = os.path.join(dst_dir, item)
    if os.path.isfile(s):
        shutil.copy2(s, d)
        print(f"Copied {s} -> {d}")

# Save full tokenizer configuration to dst_dir
tok = AutoTokenizer.from_pretrained("roberta-base")
tok.save_pretrained(dst_dir)
print(f"Saved complete tokenizer to {dst_dir}")
