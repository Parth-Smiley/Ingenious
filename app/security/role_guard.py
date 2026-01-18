from fastapi import Depends, HTTPException
from app.security.jwt_guard import get_current_user


def require_role(required_role: str):
    def checker(user=Depends(get_current_user)):
        if not user.get("username"):
            raise HTTPException(status_code=401, detail="Invalid token")

        if user["role"] != required_role:
            raise HTTPException(
                status_code=403,
                detail=f"{required_role} role required"
            )

        return user
    return checker
