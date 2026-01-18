import json
from app.ai.client import call_ollama

def explain(service_response: dict) -> dict | None:
    prompt = f"""
Return ONLY JSON.

{{
  "summary": "Explain this to a citizen in simple words",
  "next_steps": ["One helpful next step"]
}}

Service response:
{json.dumps(service_response)}
"""

    raw = call_ollama(prompt)

    raw = raw.replace("```json", "").replace("```", "").strip()

    start = raw.find("{")
    end = raw.rfind("}")

    if start == -1 or end == -1:
        return None

    return json.loads(raw[start:end + 1])
