from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app import crud, schemas
from app.utils.email_sender import send_offer_email
from app.utils.pdf_generator import generate_offer_letter

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


@router.get("/")
def get_all_applications(
    db: Session = Depends(get_db),
):
    return crud.get_all_applications(db)

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

@router.get("/{application_id}/offer-letter")
def download_offer_letter(
    application_id: str,
    db: Session = Depends(get_db),
):

    data = crud.get_application_details(
        db,
        application_id,
    )

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    pdf = generate_offer_letter(data)

    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f'attachment; filename="Offer_Letter_{data["candidate"].full_name}.pdf"'
        },
    )

@router.post("/{application_id}/send-email")
def email_offer_letter(
    application_id: str,
    db: Session = Depends(get_db),
):

    data = crud.get_application_details(
        db,
        application_id,
    )

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    pdf = generate_offer_letter(data)

    send_offer_email(
        candidate_email=data["candidate"].email,
        candidate_name=data["candidate"].full_name,
        pdf_bytes=pdf,
    )

    crud.update_application_status(
        db,
        application_id,
        "Offer Sent",
    )

    return {
        "message": "Offer Letter emailed successfully."
    }