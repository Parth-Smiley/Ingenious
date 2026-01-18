from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
import uuid

from app.database import get_db
from app.db_models.system_log import SystemLog
from app.db_models.service import Service
from app.security.role_guard import require_role
from app.ai.intent_classifier import classify_intent
from app.ai.explainer import explain

router = APIRouter()


def keyword_fallback(message: str) -> str | None:
    msg = message.lower()

    if any(k in msg for k in ["road", "water", "electricity", "complaint"]):
        return "city"
    if any(k in msg for k in ["soil", "crop", "fertilizer", "farming"]):
        return "agriculture"
    if any(k in msg for k in ["doctor", "hospital", "health"]):
        return "health"

    return None


@router.post("/request")
def core_request(
    payload: dict,
    user=Depends(require_role("citizen")),
    db: Session = Depends(get_db),
):
    message = payload.get("message")
    if not message:
        raise HTTPException(400, "message is required")

    # ---------- INTENT ----------
    intent = classify_intent(message)
    domain = intent.domain if intent and intent.confidence >= 0.1 else keyword_fallback(message)

    if not domain:
        raise HTTPException(400, "Unable to understand request intent")

    # ---------- SERVICE ----------
    service = (
        db.query(Service)
        .filter(Service.domain == domain, Service.is_enabled == True)
        .first()
    )

    if not service:
        raise HTTPException(503, f"No enabled service for {domain}")

    request_id = str(uuid.uuid4())

    # ---------- EARLY LOG (CRITICAL) ----------
    log = SystemLog(
        level="INFO",
        service="core",
        action="citizen_request",
        status=0,
        message="Citizen request received",
        details={
            "user": user["username"],
            "intent": domain,
            "request_id": request_id,
        },
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    # ---------- FORWARD ----------
    try:
        response = requests.post(
            f"{service.base_url}{service.endpoint_path}",
            json={"intent": domain, "message": message},
            headers={
                "x-core-user-name": user["username"],
                "x-core-user-role": user["role"],
                "x-core-request-id": request_id,
                "Content-Type": "application/json",
            },
            timeout=5,
        )
    except requests.RequestException as e:
        log.level = "ERROR"
        log.status = 503
        log.message = "Downstream service unreachable"
        log.details["error"] = str(e)
        db.commit()
        raise HTTPException(503, str(e))

    if response.status_code != 200:
        log.level = "ERROR"
        log.status = response.status_code
        log.message = "Downstream service error"
        log.details["response"] = response.text
        db.commit()
        raise HTTPException(502, response.text)

    service_response = response.json()
    ai_explanation = explain(service_response)

    # ---------- SUCCESS LOG ----------
    log.status = 200
    log.message = "Citizen core request processed"
    log.details.update({
        "service": service.name,
    })
    db.commit()

    return {
        "request_id": request_id,
        "user": user["username"],
        "intent": domain,
        "service": service.name,
        "service_response": service_response,
        "handled_by": "National Core Platform",
        "ai_explanation": ai_explanation,
    }
