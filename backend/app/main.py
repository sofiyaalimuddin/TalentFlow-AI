from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, dashboard, jobs, candidates, upload, job_candidate, onboarding, chatbot
from app.database.database import Base, engine
from app import models

# 1. Initialize Database Tables
Base.metadata.create_all(bind=engine)

# 2. Initialize FastAPI Application
app = FastAPI(
    title="TalentFlow AI API",
    version="1.0.0"
)

# 3. Configure CORS Middleware (Allows React to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://talentflow-ai-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Register API Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(jobs.router)
app.include_router(candidates.router)
app.include_router(upload.router)
app.include_router(job_candidate.router)
app.include_router(onboarding.router)
app.include_router(chatbot.router)

# 5. Core Endpoints
@app.get("/")
def root():
    return {
        "message": "Welcome to TalentFlow AI API 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
