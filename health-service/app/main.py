from fastapi import FastAPI, Header, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import HealthRequest, HealthResponse
from app.logic import process_health_request
from app.database import engine, get_db
from app.models import Base, HealthRequest as HealthRequestModel


app = FastAPI(title="Healthcare Service")

# ----------------------------
# Create tables on startup
# ----------------------------

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ----------------------------
# Health Request API
# ----------------------------

@app.post("/health/request", response_model=HealthResponse)
async def handle_health_request(
    payload: HealthRequest,
    db: AsyncSession = Depends(get_db),
    x_core_user_name: str = Header(...),
    x_core_user_role: str = Header(...),
    x_core_request_id: str = Header(...)
):
    # TRUST CORE HEADERS BLINDLY (as per spec)
    print("Request ID:", x_core_request_id)
    print("User:", x_core_user_name)
    print("Role:", x_core_user_role)

    try:
        # Business Logic
        result = process_health_request(payload.message)

        # Save to Database
        new_request = HealthRequestModel(
            request_id=x_core_request_id,
            user_name=x_core_user_name,
            message=payload.message,
            department=result["department"],
            status="success"
        )

        db.add(new_request)
        await db.commit()

        return result

    except Exception as e:
        print("ERROR:", e)

        return {
            "service": "health",
            "status": "failed",
            "message": "Healthcare service temporarily unavailable"
        }


# ----------------------------
# Health Check API
# ----------------------------

@app.get("/health-check")
async def health_check():
    return {
        "service": "healthcare",
        "status": "running"
    }
