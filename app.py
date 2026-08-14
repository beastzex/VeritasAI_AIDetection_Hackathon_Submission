import os
import gradio as gr
from backend.main import app as fastapi_app

def check_status():
    return {
        "status": "online",
        "service": "Veritas AI Forensics Gateway",
        "endpoints": ["/api/analyze", "/api/explain", "/api/eval-metrics", "/docs"]
    }

with gr.Blocks(title="Veritas AI Forensics API") as demo:
    gr.Markdown("# 🔬 Veritas AI — Multi-Signal Admissions Forensics API")
    gr.Markdown("FastAPI backend gateway is active. REST API endpoints `/api/analyze` and `/docs` are operational.")
    with gr.Row():
        btn = gr.Button("Check Gateway Health", variant="primary")
        out = gr.JSON()
    btn.click(fn=check_status, inputs=[], outputs=out)

# Mount Gradio app onto FastAPI
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
