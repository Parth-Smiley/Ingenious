from fastapi import APIRouter
import requests

router = APIRouter()

@router.post("/test-forward")
def test_forward(payload: dict):
    headers = {
        "x-core-user-name": "test-user"
    }

    resp = requests.post(
        "http://127.0.0.1:9100/handle",
        json=payload,
        headers=headers,
        timeout=5
    )

    return {
        "status_code": resp.status_code,
        "response": resp.json()
    }
