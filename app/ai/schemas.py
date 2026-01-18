from pydantic import BaseModel, Field
from typing import Literal

class IntentResult(BaseModel):
    domain: Literal["city", "agriculture", "health"]
    confidence: float = Field(ge=0.0, le=1.0)
