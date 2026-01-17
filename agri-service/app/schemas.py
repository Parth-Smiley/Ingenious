from pydantic import BaseModel


class AgriRequest(BaseModel):
    intent: str
    message: str


class AgriResponse(BaseModel):
    status: str
    category: str
    message: str
