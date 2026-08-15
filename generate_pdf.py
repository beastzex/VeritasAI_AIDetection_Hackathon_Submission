import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and render total page count and footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Top header border & text
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.75)
        self.line(40, 755, 572, 755)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#FC4C02"))
        self.drawString(40, 762, "VERITAS AI // EXECUTIVE TECHNICAL WHITEPAPER")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6B7280"))
        self.drawRightString(572, 762, "CONFIDENTIAL & PROPRIETARY // RESEARCH ARCHITECTURE")

        # Bottom footer border & text
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.75)
        self.line(40, 42, 572, 42)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#9CA3AF"))
        self.drawString(40, 30, "Veritas AI Admissions Forensics Engine • Multi-Signal Scientific Architecture")
        self.drawRightString(572, 30, f"Page {self._pageNumber} of {page_count}")
        
        self.restoreState()

def build_pdf(filename="Veritas_AI_Technical_Overview.pdf"):
    # Margins: 40pt left/right, 45pt top/bottom
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_PRIMARY = colors.HexColor("#0F172A")    # Deep Slate
    C_ACCENT = colors.HexColor("#FC4C02")     # Veritas Flame Orange
    C_TEAL = colors.HexColor("#0D9488")       # Verified Teal
    C_MUTED = colors.HexColor("#475569")      # Slate 600
    C_BG_CARD = colors.HexColor("#F8FAFC")    # Slate 50
    C_BORDER = colors.HexColor("#E2E8F0")     # Slate 200
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=C_PRIMARY
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=C_MUTED
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=C_PRIMARY,
        spaceBefore=8,
        spaceAfter=4
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=C_ACCENT,
        spaceBefore=4,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=C_PRIMARY
    )

    body_muted = ParagraphStyle(
        'BodyMuted',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=C_MUTED
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B")
    )

    story = []

    # ==========================================
    # PAGE 1: EXECUTIVE OVERVIEW & 4 SIGNALS
    # ==========================================
    
    # Main Header
    story.append(Paragraph("VERITAS AI — Admissions Essay Forensics Engine", title_style))
    story.append(Paragraph("Scientific Multi-Signal Text Verification, Sentence-Level Interpretability & Bias-Aware Fairness Architecture", subtitle_style))
    story.append(Spacer(1, 6))

    # Metric Highlight Badges Banner
    metric_data = [
        [
            Paragraph("<b>98.40%</b><br/><font size=7 color='#64748B'>TEST ACCURACY</font>", ParagraphStyle('M1', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=C_PRIMARY)),
            Paragraph("<b>0.9995</b><br/><font size=7 color='#64748B'>ROC-AUC SCORE</font>", ParagraphStyle('M2', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=C_PRIMARY)),
            Paragraph("<b>3.30%</b><br/><font size=7 color='#64748B'>ESL FALSE POSITIVE</font>", ParagraphStyle('M3', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=C_TEAL)),
            Paragraph("<b>96.70%</b><br/><font size=7 color='#64748B'>ESL SPECIFICITY</font>", ParagraphStyle('M4', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=C_TEAL)),
            Paragraph("<b>0.0133</b><br/><font size=7 color='#64748B'>BRIER LOSS</font>", ParagraphStyle('M5', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=C_ACCENT)),
            Paragraph("<b>0.00%</b><br/><font size=7 color='#64748B'>LLM DEPENDENCY</font>", ParagraphStyle('M6', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=C_ACCENT)),
        ]
    ]
    t_metrics = Table(metric_data, colWidths=[88, 88, 88, 88, 88, 92])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 8))

    # Executive Overview
    story.append(Paragraph("1. Executive Overview & The Non-LLM Verdict Rule", h1_style))
    story.append(Paragraph(
        "Modern commercial AI detectors rely on brittle perplexity thresholds or recursive LLM querying that produce unacceptable false positives against international applicants (ESL) while offering zero forensic explainability. <b>Veritas AI solves this through a non-LLM, multi-signal mathematical architecture.</b> Authenticity verdicts are determined strictly by deterministic statistical extractors, semantic trajectory geometry, and a fine-tuned transformer attention model. Large Language Models (Groq LLaMA 3.3 70B) are restricted entirely to post-hoc translation—narrating mathematical evidence into plain English for admissions officers without ever voting on or altering authenticity scores.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # The 4 Orthogonal Forensic Signals
    story.append(Paragraph("2. The 4 Orthogonal Analytical Signals", h1_style))
    story.append(Paragraph("Veritas extracts 8 mathematical dimensions across 4 complementary linguistic signals for every sentence:", body_muted))
    story.append(Spacer(1, 4))

    signals_table_data = [
        [
            Paragraph("<b>SIGNAL</b>", ParagraphStyle('TH1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
            Paragraph("<b>METHODOLOGY & MATHEMATICAL FORMULATION</b>", ParagraphStyle('TH2', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
            Paragraph("<b>FORENSIC WEIGHT (β)</b>", ParagraphStyle('TH3', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white, alignment=1)),
        ],
        [
            Paragraph("<b>Signal A<br/><font color='#FC4C02'>Vocabulary Signature</font></b>", body_style),
            Paragraph("Monroe et al. Dirichlet-prior log-odds ratio calculation comparing essay vocabulary against authentic human Common App baseline datasets. Identifies hallmark synthetic n-grams (e.g. <i>'testament to'</i>, <i>'pivotal role'</i>, <i>'delve into'</i>, <i>'fostering'</i>) with exact Z-score deviations.", body_style),
            Paragraph("<b>β = +1.54</b><br/><font size=7 color='#64748B'>High AI Skew</font>", ParagraphStyle('C1', fontName='Helvetica', fontSize=8, alignment=1)),
        ],
        [
            Paragraph("<b>Signal B<br/><font color='#FC4C02'>Narrative Trajectory</font></b>", body_style),
            Paragraph("Sentence-by-sentence dense embedding via MiniLM-L6-v2. Computes cosine similarity velocity across consecutive sentence pairs. Human storytelling exhibits non-linear narrative leaps and conversational tangents (high variance), while LLM outputs demonstrate monotonic, uniform semantic pacing.", body_style),
            Paragraph("<b>β = +0.57</b><br/><font size=7 color='#64748B'>Uniformity Penalty</font>", ParagraphStyle('C2', fontName='Helvetica', fontSize=8, alignment=1)),
        ],
        [
            Paragraph("<b>Signal C<br/><font color='#0D9488'>Stylometrics & Burstiness</font></b>", body_style),
            Paragraph("Quantifies structural burstiness and syntactic complexity: sentence length variance, Type-Token Ratio (TTR), Flesch-Kincaid reading grade, formulaic discourse transition counts (<i>'Moreover'</i>, <i>'In conclusion'</i>), and passive voice construction indicators.", body_style),
            Paragraph("<b>β = -0.48</b><br/><font size=7 color='#0D9488'>Burstiness Protector</font>", ParagraphStyle('C3', fontName='Helvetica', fontSize=8, alignment=1)),
        ],
        [
            Paragraph("<b>Signal D<br/><font color='#FC4C02'>Supervised Classifier</font></b>", body_style),
            Paragraph("Fine-tuned <b>DeBERTa-v3-base</b> sequence classifier trained on curated human admissions essays and frontier LLM variants (ChatGPT, Claude, Gemini, LLaMA). Operates with cross-attention token modeling to detect subtle statistical token transitions at the sentence level.", body_style),
            Paragraph("<b>β = +6.39</b><br/><font size=7 color='#64748B'>Primary Transformer</font>", ParagraphStyle('C4', fontName='Helvetica', fontSize=8, alignment=1)),
        ]
    ]

    t_signals = Table(signals_table_data, colWidths=[110, 320, 102])
    t_signals.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('ALIGN', (0,0), (-1,0), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_CARD]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_signals)
    story.append(Spacer(1, 8))

    # Sentence-Level Forensic Heatmap Concept Callout
    callout_data = [[
        Paragraph("<b>Interactive Forensic Heatmap:</b> Unlike traditional monolithic detectors that provide only a single document percentage, Veritas AI scores every sentence independently, color-coding sentences into 3 risk bands: <b>HIGH_AI (&ge;70%)</b>, <b>UNCERTAIN (40–70%)</b>, and <b>HUMAN (&lt;40%)</b>. Admissions officers can click any sentence to audit its 4-signal telemetry breakdown.", callout_style)
    ]]
    t_callout = Table(callout_data, colWidths=[532])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF2F2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FECACA")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_callout)

    # Force Page Break to Page 2
    story.append(PageBreak())

    # ==========================================
    # PAGE 2: TECH STACK, COMBINER & UNIQUENESS
    # ==========================================

    story.append(Paragraph("3. Calibrated Combiner & Decision Boundary", h1_style))
    story.append(Paragraph(
        "All extracted features are integrated using a trained <b>multivariate logistic regression combiner</b> with calibrated intercept (β<sub>0</sub> = -3.92). The model maps 8-dimensional feature vectors into an exact posterior probability P(AI | x). When evaluating essays, Signal C's length burstiness parameter (β = -0.48) directly prevents false positives on expressive human writing, while Signal D and Signal A identify synthetic homogeneity.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Full Technical Stack Breakdown Table
    story.append(Paragraph("4. End-to-End Technology Stack", h1_style))
    
    stack_data = [
        [
            Paragraph("<b>LAYER</b>", ParagraphStyle('ST1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
            Paragraph("<b>TECHNOLOGY / FRAMEWORK</b>", ParagraphStyle('ST2', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
            Paragraph("<b>ARCHITECTURAL ROLE & FUNCTION</b>", ParagraphStyle('ST3', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
        ],
        [
            Paragraph("<b>Core Backend</b>", body_style),
            Paragraph("FastAPI (Python 3.11) + Uvicorn", body_style),
            Paragraph("High-throughput asynchronous ASGI microservice orchestration with instant endpoint response and lazy singleton loading.", body_style),
        ],
        [
            Paragraph("<b>Deep Learning</b>", body_style),
            Paragraph("PyTorch + Hugging Face Transformers", body_style),
            Paragraph("DeBERTa-v3 sequence classification and sentence-level token attention scoring with CUDA acceleration / optimized CPU fallback.", body_style),
        ],
        [
            Paragraph("<b>NLP & Semantics</b>", body_style),
            Paragraph("Sentence-Transformers + spaCy + textstat", body_style),
            Paragraph("MiniLM-L6-v2 cosine trajectory modeling, robust sentencizer tokenization, Flesch reading ease, and lexical TTR analytics.", body_style),
        ],
        [
            Paragraph("<b>Combiner Engine</b>", body_style),
            Paragraph("Scikit-Learn + NumPy + Joblib", body_style),
            Paragraph("L2-regularized multivariate logistic calibration translating multi-signal telemetry into calibrated posterior probabilities.", body_style),
        ],
        [
            Paragraph("<b>Explainability</b>", body_style),
            Paragraph("Groq SDK (LLaMA 3.3 70B Versatile)", body_style),
            Paragraph("Fast post-hoc natural language synthesis translating mathematical indicators into transparent, plain-English audit summaries.", body_style),
        ],
        [
            Paragraph("<b>Frontend UI/UX</b>", body_style),
            Paragraph("React 18 + Vite + Tailwind CSS + Lucide", body_style),
            Paragraph("Professional DAW-inspired forensic workbench with interactive heatmap, radar telemetry, and dual-mode high-contrast themes.", body_style),
        ],
    ]
    t_stack = Table(stack_data, colWidths=[90, 160, 282])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_CARD]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 8))

    # What Makes Us Unique Section
    story.append(Paragraph("5. What Makes Veritas AI Truly Unique (Competitive Moat)", h1_style))

    uniqueness_points = [
        [
            Paragraph("<b>1. Absolute Non-LLM Verdict Integrity</b>", h2_style),
            Paragraph("Unlike GPT-wrapper detectors that hallucinate verdicts, Veritas uses zero LLM inference to compute authenticity. The evaluation is 100% reproducible and grounded in transparent statistical and geometric evidence.", body_style)
        ],
        [
            Paragraph("<b>2. Rigorous Non-Native (ESL) Applicant Equity & Protection</b>", h2_style),
            Paragraph("Standard commercial tools penalize international students (30%+ false positive rates) because ESL writing uses structured transition markers (<i>'Moreover'</i>, <i>'In conclusion'</i>). Veritas achieves a benchmarked <b>96.7% Specificity (3.3% FPR)</b> by compensating with narrative leap analysis.", body_style)
        ],
        [
            Paragraph("<b>3. Granular Sentence-Level Heatmap with DAW Visual Telemetry</b>", h2_style),
            Paragraph("Admissions officers receive visual evidence mapped across Introduction, Body, and Conclusion paragraphs, rather than an unhelpful single percentage.", body_style)
        ],
        [
            Paragraph("<b>4. Post-Hoc Groq Translation Without Black-Box Bias</b>", h2_style),
            Paragraph("Admissions committees can audit exactly why a sentence was flagged with transparent plain-English telemetry explanations generated in <500ms.", body_style)
        ]
    ]

    t_unique = Table(uniqueness_points, colWidths=[175, 357])
    t_unique.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, C_BORDER),
    ]))
    story.append(t_unique)
    story.append(Spacer(1, 8))

    # Summary Conclusion Callout
    final_box = [[
        Paragraph("<b>Conclusion:</b> Veritas AI establishes a new gold standard for academic and admissions integrity—delivering state-of-the-art 98.4% detection accuracy, provable fairness for international applicants, and complete scientific interpretability.", ParagraphStyle('F1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#065F46"), leading=11))
    ]]
    t_final = Table(final_box, colWidths=[532])
    t_final.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ECFDF5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_final)

    # Build Document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated 2-page PDF: {filename}")

if __name__ == "__main__":
    build_pdf()
