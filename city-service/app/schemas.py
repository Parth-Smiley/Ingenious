from pydantic import BaseModel


class CityRequest(BaseModel):
    intent: str
    message: str


class CityResponse(BaseModel):
    status: str
    department: str
    message: str
