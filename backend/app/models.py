import uuid

from sqlalchemy import (
    Column,
    String,
    Float,
    Text,
    ForeignKey,
)

from app.database.database import Base

#user model
class User(Base):
    __tablename__ = "users"

    id = Column(
    String,
    primary_key=True,
    default=lambda: str(uuid.uuid4()),
    index=True
    )
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)


#job model
class Job(Base):
    __tablename__ = "jobs"

    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4())
    )

    title = Column(String, nullable=False)
    department = Column(String)
    required_skills = Column(Text)
    description = Column(Text)

#candidate model
class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    full_name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    skills = Column(Text)
    experience = Column(Text)
    resume_path = Column(String)
    match_score = Column(Float, default=0)
    status = Column(String, default="Pending")
    matched_skills = Column(Text)
    missing_skills = Column(Text)

# JobCandidate model
class JobCandidate(Base):
    __tablename__ = "job_candidates"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )

    job_id = Column(
        String,
        ForeignKey("jobs.id"),
        nullable=False,
    )

    candidate_id = Column(
        String,
        ForeignKey("candidates.id"),
        nullable=False,
    )

    match_score = Column(Float, default=0)
    matched_skills = Column(Text)
    missing_skills = Column(Text)
    status = Column(String, default="Applied")