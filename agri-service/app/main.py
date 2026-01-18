from fastapi import FastAPI, Header
from app.schemas import AgriRequest, AgriResponse
from app.logic import process_agri_request

app = FastAPI(title="Agriculture Service")


@app.post("/agri/request", response_model=AgriResponse)
async def handle_agri_request(
    payload: AgriRequest,
    x_core_user_name: str = Header(..., alias="x-core-user-name"),
    x_core_user_role: str = Header(..., alias="x-core-user-role"),
    x_core_request_id: str = Header(None, alias="x-core-request-id"),

):
    try:
        result = process_agri_request(payload.message)
        return result

    except Exception:
        return {
            "service": "agri",
            "status": "failed",
            "message": "Agriculture service temporarily unavailable"
        }


@app.get("/health-check")
async def health_check():
    return {"status": "running", "service": "agri"}
