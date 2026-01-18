from sqlalchemy.orm import Session
from app.db_models.system_log import SystemLog

def log_event(
    db: Session,
    *,
    level: str,
    service: str,
    message: str,
    action: str = None,
    status: int = None,
    details: dict = None,
):
    log = SystemLog(
        level=level.upper(),
        service=service,
        action=action,
        status=status,
        message=message,
        details=details,
    )
    db.add(log)
    db.commit()
