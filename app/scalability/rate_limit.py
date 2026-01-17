import time
from fastapi import Depends, HTTPException
from app.security.jwt_guard import get_current_user

request_tracker = {}
MAX_REQUESTS = 3
WINDOW_SECONDS = 60


def rate_limit(user=Depends(get_current_user)):
    username = user["username"]
    now = time.time()

    if username not in request_tracker:
        request_tracker[username] = []

    request_tracker[username] = [
        t for t in request_tracker[username]
        if now - t < WINDOW_SECONDS
    ]

    if len(request_tracker[username]) >= MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded"
        )

    request_tracker[username].append(now)
