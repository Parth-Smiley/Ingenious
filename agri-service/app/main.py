from fastapi import FastAPI, Header
from app.schemas import AgriRequest, AgriResponse
from app.logic import process_agri_request

app = FastAPI(title="Agriculture Service")


@app.post("/agri/request", response_model=AgriResponse)
async def handle_agri_request(
    payload: AgriRequest,
    x_core_user_name: str = Header(...),
    x_core_user_role: str = Header(...),
    x_core_request_id: str = Header(...)
):
    return process_agri_request(payload.message)


@app.get("/health-check")
async def health_check():
    return {"status": "running", "service": "agri"}
