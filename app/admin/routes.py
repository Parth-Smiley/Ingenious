from fastapi import APIRouter, Depends
from app.logs.store import request_logs
from app.security.role_guard import require_role
from app.db_models.service import Service
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.db_models.system_log import SystemLog
from app.security.role_guard import require_role
from app.db_models.service_request import ServiceRequest

router = APIRouter(
    dependencies=[Depends(require_role("admin"))]
)
@router.get("/service-requests")
def list_service_requests(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return db.query(ServiceRequest).order_by(ServiceRequest.id.asc()).all()
@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return (
        db.query(SystemLog)
        .order_by(SystemLog.id.desc())
        .limit(100)
        .all()
    )


@router.post("/service-requests/{request_id}/approve")
def approve_service_request(
    request_id: int,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    req = db.query(ServiceRequest).get(request_id)

    if not req or req.status != "PENDING":
        raise HTTPException(400, "Invalid request")

    service = Service(
        name=req.name,
        domain=req.domain,
        base_url=req.base_url,
        endpoint_path=req.endpoint_path,
        is_enabled=True
    )

    req.status = "APPROVED"

    db.add(service)
    db.commit()

    return {"message": "Service approved and registered"}

@router.post("/service-requests/{request_id}/reject")
def reject_service_request(
    request_id: int,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    req = db.query(ServiceRequest).get(request_id)

    if not req or req.status != "PENDING":
        raise HTTPException(400, "Invalid request")

    req.status = "REJECTED"
    db.commit()

    return {"message": "Service request rejected"}

