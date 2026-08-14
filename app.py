import os
import sys
import subprocess

# Ensure spacy model is loaded or downloaded
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"], check=True)
except Exception as e:
    print(f"Notice during spacy setup: {e}")

import gradio as gr
from backend.main import app as fastapi_app

def check_health():
    return {
        "status": "healthy",
        "service": "Veritas AI Forensics Gateway",
        "endpoints": ["/api/analyze", "/api/explain", "/api/eval-metrics", "/docs"],
        "architecture": "4 Non-LLM Multi-Signal Pipeline + Regularized Logistic Regression"
    }

# Build Gradio UI
with gr.Blocks(title="Veritas AI Forensics API") as demo:
    gr.Markdown("# 🔬 Veritas AI — Multi-Signal Admissions Forensics API")
    gr.Markdown("FastAPI backend gateway is active. REST API endpoints `/api/analyze` and `/docs` are operational.")
    with gr.Row():
        btn = gr.Button("Check Gateway Health", variant="primary")
        out = gr.JSON()
    btn.click(fn=check_health, inputs=[], outputs=out)

# Mount FastAPI app onto Gradio
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

# Run demo at top level so Hugging Face Spaces starts listening immediately
demo.launch(server_name="0.0.0.0", server_port=7860, app=app)
