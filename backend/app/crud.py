from sqlalchemy.orm import Session
from app.models import User, Job, JobCandidate, Candidate
from app.schemas import UserCreate, JobCreate, CandidateCreate
from app.services.ranking_service import calculate_match_score
from app.core.security import hash_password, verify_password
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

# Authenticate user by email and password
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
def create_job(db: Session, job: JobCreate):
    db_job = Job(
        title=job.title,
        department=job.department,
        required_skills=job.required_skills,
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
    job.required_skills = updated_job.required_skills
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

# ==========================
# Candidate CRUD
# ==========================
def create_candidate(db: Session, candidate: CandidateCreate):
    db_candidate = Candidate(**candidate.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate


def get_candidates(db: Session):
    return db.query(Candidate).all()


def get_candidate(db: Session, candidate_id: str):
    return (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

def update_candidate(db: Session, candidate_id: str, updated_candidate: CandidateCreate):
    candidate = get_candidate(db, candidate_id)

    if candidate is None:
        return None

    candidate.full_name = updated_candidate.full_name
    candidate.email = updated_candidate.email
    candidate.phone = updated_candidate.phone
    candidate.skills = updated_candidate.skills
    candidate.experience = updated_candidate.experience

    db.commit()
    db.refresh(candidate)

    return candidate


def delete_candidate(db: Session, candidate_id: str):
    candidate = get_candidate(db, candidate_id)

    if candidate is None:
        return None

    db.delete(candidate)
    db.commit()

    return candidate

# apply a candidate to a job
def apply_candidate_to_job(db, job_id, candidate_id):
    return {"message": "placeholder"}

# get all candidates of a job
def get_job_candidates(db, job_id):
    return []

# remove a candidate from a job
def remove_candidate_from_job(db, application_id):
    return {"message": "deleted"}

def apply_candidate_to_job(db: Session, job_id: str, candidate_id: str):
    # Check if this candidate is already assigned to this job to prevent duplicates
    existing = db.query(JobCandidate).filter(
        JobCandidate.job_id == job_id, 
        JobCandidate.candidate_id == candidate_id
    ).first()
    if existing:
        return existing
    
    job = db.query(Job).filter(Job.id == job_id).first()
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not job or not candidate:
        raise ValueError("Job or Candidate not found")

    ranking = calculate_match_score(
        job.required_skills,
        candidate.skills,
    )

    # Create the link record
    db_application = JobCandidate(
        job_id=job_id,
        candidate_id=candidate_id,
        match_score=ranking["score"],
        matched_skills=ranking["matched_skills"],
        missing_skills=ranking["missing_skills"],
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_job_candidates(db: Session, job_id: str):
    # Fetch all records assigned to this job
    return db.query(JobCandidate).filter(JobCandidate.job_id == job_id).all()

def remove_candidate_from_job(db: Session, application_id: str):
    # Find the application record and delete it
    db_application = db.query(JobCandidate).filter(JobCandidate.id == application_id).first()
    if db_application:
        db.delete(db_application)
        db.commit()
        return {"message": "Successfully deleted application assignment"}
    return {"message": "Application not found"}

def get_applications_by_job(db: Session, job_id: str):
    return (
        db.query(JobCandidate)
        .filter(JobCandidate.job_id == job_id)
        .order_by(JobCandidate.match_score.desc())
        .all()
    )