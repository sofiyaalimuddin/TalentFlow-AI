from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate
from app.core.security import hash_password
import uuid

# User authentication and CRUD operations
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

# ==========================
# Job CRUD
# ==========================

from app.models import Job
from app.schemas import JobCreate

def create_job(db: Session, job: JobCreate):
    db_job = Job(
        title=job.title,
        department=job.department,
        description=job.description,
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return db_job

def get_jobs(db: Session):
    return db.query(Job).all()

def get_job(db: Session, job_id: str):
    return (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

def update_job(db: Session, job_id: str, updated_job: JobCreate):
    job = get_job(db, job_id)

    if job is None:
        return None

    job.title = updated_job.title
    job.department = updated_job.department
    job.description = updated_job.description

    db.commit()
    db.refresh(job)

    return job


def delete_job(db: Session, job_id: str):
    job = get_job(db, job_id)

    if job is None:
        return None

    db.delete(job)
    db.commit()

    return job