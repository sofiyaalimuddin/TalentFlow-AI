from pprint import pprint

from app.services.resume_service import parse_resume

data = parse_resume(
    "uploads/83060c62-2afa-4ac7-a0bd-deaabb2002c5.pdf"
)

pprint(data)