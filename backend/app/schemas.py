from pydantic import BaseModel, EmailStr

# User Creation scema
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

# User Login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Jon Creation schema
class JobCreate(BaseModel):
    title: str
    department: str
    required_skills: str
    description: str

# Job Response schema
class JobResponse(JobCreate):
    id: str

    class Config:
        from_attributes = True

# Candidate Creation schema
class CandidateCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    skills: str
    experience: str
    resume_path: str | None = None

# Candidate Response schema
class CandidateResponse(CandidateCreate):
    id: str
    resume_path: str | None = None
    match_score: float = 0
    status: str = "Pending"

    class Config:
        from_attributes = True
        match_score: float = 0
        matched_skills: str | None = None
        missing_skills: str | None = None

#Job Application Creation schema
class JobApplicationCreate(BaseModel):
    job_id: str
    candidate_id: str
    class Config:
        from_attributes = True