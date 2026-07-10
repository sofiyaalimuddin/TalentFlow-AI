from sqlalchemy.orm import Session
from app.models import User, Job, JobCandidate, Candidate
from app.schemas import UserCreate, JobCreate, CandidateCreate
from app.services.ranking_service import calculate_match_score
from app.core.security import hash_password, verify_password
from sqlalchemy.exc import IntegrityError
import uuid

# ==========================
# Authentication user CRUD
# ==========================
# Create User
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
#Create job
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

# Get number of jobs
def get_jobs(db: Session):
    return db.query(Job).all()

# Get a specific job by ID
def get_job(db: Session, job_id: str):
    return (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

# Update a specific job by ID
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

# Delete a specific job by ID
def delete_job(db: Session, job_id: str):
    job = get_job(db, job_id)

    if job is None:
        return None

    db.delete(job)
    db.commit()

    return True

# ==========================
# Candidate CRUD
# ==========================
# Create a new candidate
def create_candidate(db: Session, candidate: CandidateCreate):
    db_candidate = Candidate(**candidate.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

# Get all candidates
def get_candidates(db: Session):
    return db.query(Candidate).all()

# Get a specific candidate by ID
def get_candidate(db: Session, candidate_id: str):
    return (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

# Update a specific candidate by ID
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

# Delete a specific candidate by ID
def delete_candidate(db: Session, candidate_id: str):
    candidate = get_candidate(db, candidate_id)

    if candidate is None:
        return None

    try:
        db.delete(candidate)
        db.commit()
        return True

    except IntegrityError:
        db.rollback()
        return False
# ==========================
# Job Application CRUD
# ==========================

# Apply a candidate to a job
def apply_candidate_to_job(db: Session, job_id: str, candidate_id: str):
    # 1. Prevent duplicates early
    existing = db.query(JobCandidate).filter(
        JobCandidate.job_id == job_id, 
        JobCandidate.candidate_id == candidate_id
    ).first()
    if existing:
        return existing
    
    # 2. Verify both exist
    job = db.query(Job).filter(Job.id == job_id).first()
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not job or not candidate:
        raise ValueError("Job or Candidate not found")

    # 3. Calculate match metrics
    ranking = calculate_match_score(
        job.required_skills,
        candidate.skills,
    )

    # 4. Save to database
    db_application = JobCandidate(
        job_id=job_id,
        candidate_id=candidate_id,
        match_score=ranking["score"],
        matched_skills=ranking["matched_skills"],
        missing_skills=ranking["missing_skills"],
        status="Applied"  # Good practice to explicitly set an initial state
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


# Get all raw mapping records for a specific job
def get_job_candidates(db: Session, job_id: str):
    return db.query(JobCandidate).filter(JobCandidate.job_id == job_id).all()


# Remove a candidate from a specific job
def remove_candidate_from_job(db: Session, application_id: str):
    db_application = db.query(JobCandidate).filter(JobCandidate.id == application_id).first()
    if db_application:
        db.delete(db_application)
        db.commit()
        return {"message": "Successfully deleted application assignment"}
    return {"message": "Application not found"}


# OPTIMIZED: Get all applications with Candidate details using an inner join (1 single query!)
def get_applications_by_job(db: Session, job_id: str):
    # Joining JobCandidate and Candidate tables together 
    # and sorting by match score descending
    applications_with_candidates = (
        db.query(JobCandidate, Candidate)
        .join(Candidate, JobCandidate.candidate_id == Candidate.id)
        .filter(JobCandidate.job_id == job_id)
        .order_by(JobCandidate.match_score.desc())
        .all()
    )

    result = []
    # Loop over the joined tuples directly without hit-testing the DB again
    for application, candidate in applications_with_candidates:
        result.append({
            "id": application.id,
            "candidate_id": application.candidate_id,
            "candidate_name": candidate.full_name if candidate else "Unknown",
            "match_score": application.match_score,
            "matched_skills": application.matched_skills,
            "missing_skills": application.missing_skills,
            "status": application.status,
        })

    return result

# OPTIMIZED: Get all applications with Candidate and Job details using an inner join (1 single query!)
def get_all_applications(db: Session):

    applications = (
        db.query(JobCandidate, Candidate, Job)
        .join(Candidate, JobCandidate.candidate_id == Candidate.id)
        .join(Job, JobCandidate.job_id == Job.id)
        .order_by(JobCandidate.match_score.desc())
        .all()
    )

    result = []

    for application, candidate, job in applications:

        result.append({

            "id": application.id,

            "job_id": job.id,

            "job_title": job.title,

            "candidate_id": candidate.id,

            "candidate_name": candidate.full_name,

            "match_score": application.match_score,

            "matched_skills": application.matched_skills,

            "missing_skills": application.missing_skills,

            "status": application.status,

        })

    return result

def get_application_details(db: Session, application_id: str):

    result = (
        db.query(JobCandidate, Candidate, Job)
        .join(
            Candidate,
            JobCandidate.candidate_id == Candidate.id,
        )
        .join(
            Job,
            JobCandidate.job_id == Job.id,
        )
        .filter(
            JobCandidate.id == application_id,
        )
        .first()
    )

    if not result:
        return None

    application, candidate, job = result

    return {
        "application": application,
        "candidate": candidate,
        "job": job,
    }

def update_application_status(
    db: Session,
    application_id: str,
    status: str,
):
    application = (
        db.query(JobCandidate)
        .filter(JobCandidate.id == application_id)
        .first()
    )

    if not application:
        return None

    application.status = status

    db.commit()
    db.refresh(application)

    return application


def get_dashboard_stats(db: Session):

    total_jobs = db.query(Job).count()

    total_candidates = db.query(Candidate).count()

    pending = (
        db.query(JobCandidate)
        .filter(JobCandidate.status != "Onboarded")
        .count()
    )

    top_application = (
        db.query(JobCandidate)
        .order_by(JobCandidate.match_score.desc())
        .first()
    )

    top_candidate = "None"

    if top_application:
        candidate = (
            db.query(Candidate)
            .filter(Candidate.id == top_application.candidate_id)
            .first()
        )

        if candidate:
            top_candidate = candidate.full_name

    return {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "pending_onboarding": pending,
        "top_candidate": top_candidate,
    }

# get all candidates who are in the onboarding process (status != "Onboarded")
def get_onboarding_candidates(db: Session):

    applications = (
        db.query(JobCandidate, Candidate, Job)
        .join(Candidate, JobCandidate.candidate_id == Candidate.id)
        .join(Job, JobCandidate.job_id == Job.id)
        .all()
    )

    result = []

    for application, candidate, job in applications:

        result.append({
            "application_id": application.id,
            "candidate_name": candidate.full_name,
            "job_title": job.title,
            "status": application.status,
        })

    return result

# onboard a candidate by updating their application status to "Onboarded"
def onboard_candidate(
    db: Session,
    application_id: str,
):

    application = (
        db.query(JobCandidate)
        .filter(JobCandidate.id == application_id)
        .first()
    )

    if not application:
        return None

    application.status = "Onboarded"

    db.commit()
    db.refresh(application)

    return application
