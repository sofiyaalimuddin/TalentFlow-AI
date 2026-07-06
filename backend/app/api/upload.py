import os
import uuid
import shutil
from app.services.resume_service import parse_resume

from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

UPLOAD_FOLDER = "uploads"

ALLOWED_EXTENSIONS = {
    "pdf",
    "doc",
    "docx",
}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/resume")
async def upload_resume(file: UploadFile = File(...)):

    extension = file.filename.split(".")[-1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
        status_code=400,
        detail="Only PDF, DOC and DOCX files are allowed.",
)

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "filename": filename,
        "path": filepath,
    }

@router.post("/parse-resume")
async def parse_uploaded_resume(
    file: UploadFile = File(...)
):

    extension = file.filename.split(".")[-1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC and DOCX files are allowed.",
        )

    filename = f"{uuid.uuid4()}.{extension}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    parsed_data = parse_resume(file_path)

    parsed_data["resume_path"] = file_path

    return parsed_data

