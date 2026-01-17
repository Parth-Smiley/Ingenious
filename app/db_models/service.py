from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    domain = Column(String, index=True, nullable=False)
    base_url = Column(String, nullable=False)
    is_enabled = Column(Boolean, default=True)
    endpoint_path = Column(String, nullable=False)
