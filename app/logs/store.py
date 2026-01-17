from datetime import datetime
from uuid import uuid4

request_logs = []

def log_request(user: str, intent: str, service: str):
    log_entry = {
        "id": str(uuid4()),
        "user": user,
        "intent": intent,
        "service": service,
        "timestamp": datetime.utcnow().isoformat()
    }
    request_logs.append(log_entry)
