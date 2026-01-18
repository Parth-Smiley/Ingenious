from fastapi import FastAPI, Header
from app.schemas import CityRequest, CityResponse
from app.logic import process_city_request

app = FastAPI(title="City Service")


@app.post("/city/request")
def handle_city(
    payload: CityRequest,
    x_core_user_name: str = Header(...),
    x_core_user_role: str = Header(...),
    x_core_request_id: str = Header(...),
):
    msg = payload.message.lower()

    if "road" in msg:
        department = "Road & Transport"
    elif "water" in msg:
        department = "Water Supply"
    else:
        department = "Municipal Services"

    return {
        "status": "success",
        "department": department,
        "message": "City complaint registered"
    }


@app.get("/health-check")
async def health_check():
    return {"status": "running", "service": "city"}
