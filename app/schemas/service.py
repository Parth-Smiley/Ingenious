from pydantic import BaseModel



class ServiceCreate(BaseModel):
    name: str
    domain: str
    base_url: str
    endpoint_path: str  # ⭐ ADD THIS

class ServiceResponse(BaseModel):
    id: int
    name: str
    domain: str
    base_url: str
    endpoint_path: str  # ⭐ ADD THIS
    is_enabled: bool

