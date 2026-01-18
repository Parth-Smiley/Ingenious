import requests
import json

def call_ollama(prompt: str) -> str:
   

    resp = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "gemma3:1b",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.1,
            "num_predict": 128
        },
        timeout=30
    )

    data = resp.json()
    

    if "response" not in data:
        raise RuntimeError("No 'response' key in Ollama output")

    return data["response"]
