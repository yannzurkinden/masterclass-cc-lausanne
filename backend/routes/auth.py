from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
import bcrypt
from itsdangerous import URLSafeSerializer

from database import get_db
from models.user import User
from schemas.user import UserRegister, UserLogin, UserResponse
from config import SECRET_KEY, SESSION_COOKIE_NAME

router = APIRouter(prefix="/api/auth", tags=["auth"])
serializer = URLSafeSerializer(SECRET_KEY)


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    session_cookie = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        user_id = serializer.loads(session_cookie)
    except Exception:
        raise HTTPException(status_code=401, detail="Session invalide")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user


@router.post("/register", response_model=UserResponse)
def register(data: UserRegister, response: Response, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user = User(email=data.email, password_hash=password_hash, name=data.name)
    db.add(user)
    db.commit()
    db.refresh(user)

    session_token = serializer.dumps(user.id)
    response.set_cookie(
        SESSION_COOKIE_NAME, session_token, httponly=True, samesite="lax", max_age=86400
    )
    return user


@router.post("/login", response_model=UserResponse)
def login(data: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    session_token = serializer.dumps(user.id)
    response.set_cookie(
        SESSION_COOKIE_NAME, session_token, httponly=True, samesite="lax", max_age=86400
    )
    return user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(SESSION_COOKIE_NAME)
    return {"message": "Déconnexion réussie"}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
