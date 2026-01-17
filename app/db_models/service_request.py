from sqlalchemy import Column, Integer, String
from app.database import Base

class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    base_url = Column(String, nullable=False)
    endpoint_path = Column(String, nullable=False)
    status = Column(String, default="PENDING")
