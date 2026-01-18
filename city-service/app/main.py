from fastapi import FastAPI, Header, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import CityRequest, CityResponse
from app.logic import process_city_request
from app.database import engine, get_db
from app.models import Base, CityRequest as CityRequestModel


app = FastAPI(title="City Service")


# ----------------------------
# Create tables on startup
# ----------------------------

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ----------------------------
# City Request API
# ----------------------------

@app.post("/city/request", response_model=CityResponse)
async def handle_city_request(
    payload: CityRequest,
    db: AsyncSession = Depends(get_db),
    x_core_user_name: str = Header(...),
    x_core_user_role: str = Header(...),
    x_core_request_id: str = Header(...)
):

    print("Request ID:", x_core_request_id)
    print("User:", x_core_user_name)

    try:
        result = process_city_request(payload.message)

        new_request = CityRequestModel(
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
            "service": "city",
            "status": "failed",
            "message": "City service unavailable"
        }


# ----------------------------
# Health Check
# ----------------------------

@app.get("/health-check")
async def health_check():
    return {
        "service": "city",
        "status": "running"
    }
