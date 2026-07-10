from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app import crud

router = APIRouter(
    prefix="/onboarding",
    tags=["Onboarding"],
)


@router.get("/")
def get_onboarding(
    db: Session = Depends(get_db),
):
    return crud.get_onboarding_candidates(db)


@router.put("/{application_id}")
def onboard_candidate(
    application_id: str,
    db: Session = Depends(get_db),
):

    application = crud.onboard_candidate(
        db,
        application_id,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return {
        "message": "Candidate onboarded successfully."
    }