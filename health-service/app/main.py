from fastapi import FastAPI, Header, HTTPException
from app.schemas import HealthRequest, HealthResponse
from app.logic import process_health_request

app = FastAPI(title="Healthcare Service")

@app.post("/health/request", response_model=HealthResponse)
async def handle_health_request(
    payload: HealthRequest,
    x_core_user_name: str = Header(...),
    x_core_user_role: str = Header(...),
    x_core_request_id: str = Header(...)
):
    # TRUST CORE HEADERS BLINDLY (as per spec)
    print("Request ID:", x_core_request_id)
    print("User:", x_core_user_name)
    print("Role:", x_core_user_role)

    # Only process healthcare logic
    result = process_health_request(payload.message)

    return result


@app.get("/health-check")
async def health_check():
    return {"service": "healthcare", "status": "running"}
