from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime


class Base(DeclarativeBase):
    pass


class AgriRequest(Base):
    __tablename__ = "agri_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String)
    user_name = Column(String)
    message = Column(String)
    category = Column(String)
    status = Column(String, default="success")
    created_at = Column(DateTime, default=datetime.utcnow)
