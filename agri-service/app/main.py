from fastapi import FastAPI, Header, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import AgriRequest, AgriResponse
from app.logic import process_agri_request
from app.database import engine, get_db
from app.models import Base, AgriRequest as AgriRequestModel


app = FastAPI(title="Agriculture Service")


# ----------------------------
# Create tables on startup
# ----------------------------

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ----------------------------
# Agri Request API
# ----------------------------

@app.post("/agri/request", response_model=AgriResponse)
async def handle_agri_request(
    payload: AgriRequest,
    db: AsyncSession = Depends(get_db),
    x_core_user_name: str = Header(...),
    x_core_user_role: str = Header(...),
    x_core_request_id: str = Header(...)
):

    print("Request ID:", x_core_request_id)
    print("User:", x_core_user_name)

    try:
        result = process_agri_request(payload.message)

        new_request = AgriRequestModel(
            request_id=x_core_request_id,
            user_name=x_core_user_name,
            message=payload.message,
            category=result["category"],
            status="success"
        )

        db.add(new_request)
        await db.commit()

        return result

    except Exception as e:
        print("ERROR:", e)

        return {
            "service": "agri",
            "status": "failed",
            "message": "Agriculture service unavailable"
        }


# ----------------------------
# Health Check
# ----------------------------

@app.get("/health-check")
async def health_check():
    return {
        "service": "agriculture",
        "status": "running"
    }
