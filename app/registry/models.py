from pydantic import BaseModel
from typing import Literal
from uuid import uuid4

class Service(BaseModel):
    id: str = None
    name: str
    domain: Literal["health", "agriculture", "city"]
    base_url: str
    is_enabled: bool = True

    def assign_id(self):
        self.id = str(uuid4())
