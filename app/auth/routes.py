from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.db_models.user import User
from app.security.passwords import verify_password
from app.security.jwt_utils import create_access_token
from app.security.passwords import hash_password
router = APIRouter()



class LoginRequest(BaseModel):
    username: str
    password: str
    

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str

@router.post("/register")
def register_user(
    payload: RegisterRequest,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        username=payload.username,
        password_hash=hash_password(payload.password),
        role=payload.role
    )

    db.add(user)
    db.commit()

    return {"message": "User registered successfully"}
@router.post("/login")
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == payload.username).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user.username,
        "role": user.role
    })

    return {
        "access_token": token,
        "role": user.role
    }
