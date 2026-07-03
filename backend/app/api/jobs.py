from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas import JobCreate
from app.crud import (
    create_job,
    get_jobs,
    get_job,
    update_job,
    delete_job,
)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.post("/")
def add_job(job: JobCreate, db: Session = Depends(get_db)):
    return create_job(db, job)


@router.get("/")
def read_jobs(db: Session = Depends(get_db)):
    return get_jobs(db)


@router.get("/{job_id}")
def read_job(job_id: str, db: Session = Depends(get_db)):
    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return job


@router.put("/{job_id}")
def edit_job(
    job_id: str,
    job: JobCreate,
    db: Session = Depends(get_db),
):
    updated = update_job(db, job_id, job)

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return updated


@router.delete("/{job_id}")
def remove_job(
    job_id: str,
    db: Session = Depends(get_db),
):
    deleted = delete_job(db, job_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return {
        "message": "Job deleted successfully"
    }