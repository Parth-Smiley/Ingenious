from fastapi import FastAPI, Header
from app.schemas import CityRequest, CityResponse
from app.logic import process_city_request

app = FastAPI(title="City Service")


@app.post("/city/request", response_model=CityResponse)
async def handle_city_request(
    payload: CityRequest,
    x_core_user_name: str = Header(...),
    x_core_user_role: str = Header(...),
    x_core_request_id: str = Header(...)
):
    return process_city_request(payload.message)


@app.get("/health-check")
async def health_check():
    return {"status": "running", "service": "city"}
