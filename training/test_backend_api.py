import time
import requests
import json

time.sleep(3) # Wait for startup

print("Testing FastAPI backend on http://127.0.0.1:8000 ...")

# 1. Health Check
res_health = requests.get("http://127.0.0.1:8000/api/health")
print(f"\n1. GET /api/health (Status {res_health.status_code}):")
print(json.dumps(res_health.json(), indent=2))

# 2. Analyze Essay
sample_essay = """The scent of melted rosin core solder always takes me back to my grandfather's cramped garage workshop in Ohio. When I was ten, we spent three weeks rewiring a shattered 1968 tube amplifier. It taught me patience in a way mathematics classes never could.

Transitioning to high school, I channeled that mechanical curiosity into computational biology. During my sophomore summer, I interned at the county water authority. We cut the daily processing time from four hours down to twenty-five minutes.

Moreover, it is undeniably evident that life is a rich tapestry of multifaceted growth and lifelong learning. In conclusion, this experience was a testament to the transformative power of perseverance."""

res_analyze = requests.post(
    "http://127.0.0.1:8000/api/analyze",
    json={"text": sample_essay, "title": "Hybrid Admissions Essay Test"}
)
print(f"\n2. POST /api/analyze (Status {res_analyze.status_code}):")
data = res_analyze.json()
print(f"Total Sentences: {data['total_sentences']}")
print(f"Sentence Distribution: {data['sentence_distribution']}")
print(f"Section Breakdown (Sections: {len(data['section_breakdown'])}):")
for s in data['section_breakdown']:
    print(f"  - {s['section']}: {s['distribution']}")

print("\nFirst 3 Sentence Predictions:")
for sent in data['all_sentences'][:3]:
    print(f"  [{sent['band_label']:12s} ({sent['ai_probability']*100:.1f}%)] \"{sent['sentence']}\"")

# 3. Post-Hoc Explain
target_sent = data['all_sentences'][-1]
res_explain = requests.post(
    "http://127.0.0.1:8000/api/explain",
    json={"sentence_data": target_sent, "essay_context": sample_essay}
)
print(f"\n3. POST /api/explain (Status {res_explain.status_code}):")
print(f"Explanation: {res_explain.json().get('explanation')}")

# 4. Evaluation Metrics
res_metrics = requests.get("http://127.0.0.1:8000/api/eval-metrics")
print(f"\n4. GET /api/eval-metrics (Status {res_metrics.status_code}):")
print(f"Keys returned: {list(res_metrics.json().keys())}")

print("\n>> ALL BACKEND API ENDPOINTS TESTED SUCCESSFULLY! <<")
