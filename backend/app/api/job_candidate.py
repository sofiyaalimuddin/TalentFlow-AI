from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db 
from app import crud, schemas

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.post("/")
def apply_candidate(
    job_id: str,
    candidate_id: str,
    db: Session = Depends(get_db),
):
    return crud.apply_candidate_to_job(db, job_id, candidate_id)


@router.get("/{job_id}")
def get_candidates_of_job(
    job_id: str,
    db: Session = Depends(get_db),
):
    return crud.get_applications_by_job(db, job_id)

@router.delete("/{application_id}")
def remove_application(
    application_id: str,
    db: Session = Depends(get_db),
):
    return crud.remove_candidate_from_job(db, application_id)