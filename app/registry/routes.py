from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.service import ServiceCreate, ServiceResponse
from app.database import get_db
from pydantic import BaseModel
from app.db_models.service import Service
from app.security.role_guard import require_role
from app.security.role_guard import require_role
from app.db_models.service_request import ServiceRequest

router = APIRouter()

class ServiceRequestIn(BaseModel):
    name: str
    domain: str
    base_url: str
    endpoint_path: str

from app.db_models.service_request import ServiceRequest

@router.post("/service-requests")
def create_service_request(
    payload: dict,
    user = Depends(require_role("provider")),
    db: Session = Depends(get_db),
):
    req = ServiceRequest(
        name=payload["name"],
        domain=payload["domain"],
        base_url=payload["base_url"],
        endpoint_path=payload["endpoint_path"],
        status="PENDING",
    )

    db.add(req)
    db.commit()
    db.refresh(req)

    return {
        "message": "Service request submitted",
        "id": req.id,
        "status": req.status,
    }

@router.get("/service-requests")
def list_service_requests(
    user = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return db.query(ServiceRequest).all()
@router.post("/service-requests/{request_id}/approve")
def approve_service_request(
    request_id: int,
    user = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    req = db.query(ServiceRequest).get(request_id)

    if not req or req.status != "PENDING":
        raise HTTPException(400, "Invalid request")

    # mark approved
    req.status = "APPROVED"

    # create actual service
    service = Service(
        name=req.name,
        domain=req.domain,
        base_url=req.base_url,
        endpoint_path=req.endpoint_path,
        is_enabled=True,
    )

    db.add(service)
    db.commit()

    return {"message": "Service approved"}

@router.post("/services")
def register_service(
    service: ServiceCreate,
    db: Session = Depends(get_db)
):
    db_service = Service(
        name=service.name,
        domain=service.domain,
        base_url=service.base_url,
        endpoint_path=service.endpoint_path,
        is_enabled=True
    )


    db.add(db_service)
    db.commit()
    db.refresh(db_service)

    return {
        "message": "Service registered",
        "service": {
            "id": db_service.id,
            "name": db_service.name,
            "domain": db_service.domain,
            "base_url": db_service.base_url,
            "endpoint_path": db_service.endpoint_path,
            "is_enabled": db_service.is_enabled
        }
    }


@router.get("/services")
def list_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return services


@router.patch("/services/{service_id}/enable")
def enable_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    service.is_enabled = True
    db.commit()

    return {"message": "Service enabled"}


@router.patch("/services/{service_id}/disable")
def disable_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    service.is_enabled = False
    db.commit()

    return {"message": "Service disabled"}

