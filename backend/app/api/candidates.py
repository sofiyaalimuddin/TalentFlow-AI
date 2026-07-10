from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas import CandidateCreate
from app.crud import (
    create_candidate,
    get_candidates,
    get_candidate,
    update_candidate,
    delete_candidate,
)

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


@router.post("/")
def add_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    return create_candidate(db, candidate)


@router.get("/")
def read_candidates(db: Session = Depends(get_db)):
    return get_candidates(db)


@router.get("/{candidate_id}")
def read_candidate(candidate_id: str, db: Session = Depends(get_db)):
    candidate = get_candidate(db, candidate_id)

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    return candidate


@router.put("/{candidate_id}")
def edit_candidate(
    candidate_id: str,
    candidate: CandidateCreate,
    db: Session = Depends(get_db),
):
    updated = update_candidate(
        db,
        candidate_id,
        candidate,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    return updated

@router.delete("/{candidate_id}")
def remove_candidate(
    candidate_id: str,
    db: Session = Depends(get_db),
):
    deleted = delete_candidate(db, candidate_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    if deleted is False:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete candidate because they have existing job applications.",
        )

    return {
        "message": "Candidate deleted successfully"
    }
