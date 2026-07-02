import uuid

#user model
from sqlalchemy import Column, String, Text
from app.database import Base

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

    from sqlalchemy import Text

#job model
class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    department = Column(String)
    description = Column(Text)

#candidate model
from sqlalchemy import Float

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    skills = Column(Text)
    experience = Column(Text)
    resume_path = Column(String)
    match_score = Column(Float, default=0)
    status = Column(String, default="Pending")