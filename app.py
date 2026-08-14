import os
import gradio as gr
from backend.main import app

def api_status_info():
    return {
        "status": "online",
        "name": "Veritas AI Forensics Gateway",
        "endpoints": ["/api/analyze", "/api/explain", "/api/eval-metrics", "/docs"],
        "architecture": "4 Non-LLM Multi-Signal Pipeline + Logistic Regression Combiner"
    }

# Interactive Gradio Explorer for quick testing
with gr.Blocks(title="Veritas AI API Gateway") as demo:
    gr.Markdown("# 🔬 Veritas AI — Multi-Signal Admissions Forensics API")
    gr.Markdown("This Hugging Face Space hosts the high-performance FastAPI backend gateway for Veritas AI. All `/api/*` REST endpoints and `/docs` Swagger documentation are live.")
    
    with gr.Row():
        btn = gr.Button("Check Gateway Health", variant="primary")
        out = gr.JSON()
        
    btn.click(fn=api_status_info, inputs=[], outputs=out)

# Mount the Gradio app onto FastAPI
app_mounted = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app_mounted, host="0.0.0.0", port=port)
