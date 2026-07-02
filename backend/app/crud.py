from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate
from app.core.security import hash_password
import uuid


def create_user(db: Session, user: UserCreate):
    db_user = User(
        id=str(uuid.uuid4()),
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

from app.core.security import verify_password


def authenticate_user(db: Session, email: str, password: str):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user