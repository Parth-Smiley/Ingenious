print("🔥 LOADED CORE ROUTES FROM:", __file__)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
import uuid

from app.database import get_db
from app.db_models.service import Service
from app.security.role_guard import require_role

router = APIRouter()


@router.post("/request")
def core_request(
    payload: dict,
    user=Depends(require_role("citizen")),
    db: Session = Depends(get_db),
):
    message = payload.get("message", "").lower()

    # ---- INTENT DETECTION ----
    if any(word in message for word in ["soil", "fertilizer", "crop", "farming"]):
        domain = "agriculture"
    elif any(word in message for word in ["road", "water", "electricity", "municipal"]):
        domain = "city"
    elif any(word in message for word in ["doctor", "hospital", "medical", "health"]):
        domain = "health"
    else:
        raise HTTPException(
            status_code=400,
            detail="Unable to understand request intent"
        )

    # ---- SERVICE RESOLUTION (THIS IS THE KEY FIX) ----
    service = (
        db.query(Service)
        .filter(
            Service.domain == domain,
            Service.is_enabled == True
        )
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=503,
            detail=f"No enabled service available for {domain}",
        )

    request_id = str(uuid.uuid4())

    headers = {
        "X-Core-User-Name": user["username"],
        "X-Core-User-Role": user["role"],
        "X-Core-Request-ID": request_id,
    }

    service_payload = {
        "intent": domain,
        "message": payload.get("message"),
    }
    print("SERVICE TYPE:", type(service))
    print("SERVICE VALUE:", service)

    url = f"{service.base_url}{service.endpoint_path}"

    try:
        response = requests.post(
            url,
            json=service_payload,
            headers=headers,
            timeout=5,
        )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Downstream service unreachable: {str(e)}",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=response.text,
        )

    return {
        "request_id": request_id,
        "user": user["username"],
        "intent": domain,
        "service": service.name,
        "service_response": response.json(),
        "handled_by": "National Core Platform",
    }

