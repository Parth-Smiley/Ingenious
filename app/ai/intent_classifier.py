import json
import re
from .client import call_ollama
from .prompts import INTENT_CLASSIFIER_PROMPT
from .schemas import IntentResult

def classify_intent(message: str) -> IntentResult | None:
    prompt = INTENT_CLASSIFIER_PROMPT.format(message=message)

    try:
        raw = call_ollama(prompt)
        data = _extract_json(raw)
        return IntentResult(**data)
    except Exception as e:
        # log later
        return None

    
def _extract_json(text: str) -> dict:
    """
    Extracts first JSON object from text.
    Works even if model adds markdown or extra text.
    """
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found")

    return json.loads(match.group())
