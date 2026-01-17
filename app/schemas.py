from pydantic import BaseModel

class HealthRequest(BaseModel):
    intent: str
    message: str


class HealthResponse(BaseModel):
    status: str
    department: str
    message: str
