from fastapi import FastAPI
from app.api import auth


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TalentFlow AI API",
    version="1.0.0"
)
app.include_router(auth.router)

# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

from app.database.database import Base, engine
from app import models

Base.metadata.create_all(bind=engine)

