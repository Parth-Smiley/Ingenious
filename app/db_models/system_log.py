from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.database import Base


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    level = Column(String(10), nullable=False)
    service = Column(String(50), nullable=False)
    action = Column(String(100))
    status = Column(Integer)

    message = Column(Text, nullable=False)
    details = Column(JSONB)
