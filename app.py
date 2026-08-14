import os
import sys
import subprocess

# Ensure spacy english model is available
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"], check=True)
except Exception as e:
    print(f"Notice during spacy setup: {e}")

import uvicorn
from backend.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"Starting Veritas AI FastAPI Gateway on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
