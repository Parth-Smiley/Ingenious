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
    msg = message.lower()

    CITY_KEYWORDS = ["road", "street", "water", "electricity", "municipal", "complaint"]
    AGRI_KEYWORDS = ["soil", "crop", "fertilizer", "farming", "agriculture"]

    if any(k in msg for k in CITY_KEYWORDS):
        domain = "city"
    elif any(k in msg for k in AGRI_KEYWORDS):
        domain = "agriculture"
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
        "x-core-user-name": user["username"],
        "x-core-user-role": user["role"],
        "x-core-request-id": str(uuid.uuid4()),
        "Content-Type": "application/json"
    }



    service_payload = {
        "intent":domain,
        "message": payload.get("message"),
    }
    print("SERVICE TYPE:", type(service))
    print("SERVICE VALUE:", service)

    url = f"{service.base_url}{service.endpoint_path}"
  # use your actual city port


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

