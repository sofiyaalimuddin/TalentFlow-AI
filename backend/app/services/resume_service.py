import fitz  # PyMuPDF
import re

# Extract text from a PDF file (resume)
def extract_resume_text(file_path: str):

    text = ""

    document = fitz.open(file_path)

    for page in document:
        text += page.get_text()

    document.close()

    return text

# Extract email address from the extracted text
def extract_email(text: str):

    match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text,
    )

    if match:
        return match.group()

    return ""

# Extract phone number from the extracted text
def extract_phone(text: str):

    match = re.search(
        r"(\+91[-\s]?)?[6-9]\d{9}",
        text,
    )

    if match:
        return match.group()

    return ""

# Extract name from the extracted text
def extract_name(text: str):

    lines = text.splitlines()

    for line in lines:

        line = line.strip()

        if len(line) > 2:
            return line

    return ""

# Extract skills from the extracted text
def extract_skills(text: str):

    skill_list = [

        "Python",
        "Java",
        "C",
        "C++",
        "JavaScript",
        "HTML",
        "CSS",
        "Bootstrap",
        "React",
        "FastAPI",
        "SQL",
        "PostgreSQL",
        "Git",
        "GitHub",
        "Machine Learning",
        "AI",
        "Google Apps Script",
        "Excel",

    ]

    found = []

    

    for skill in skill_list:
        pattern = rf"\b{re.escape(skill)}\b" #lower_text = text.lower()
        if re.search(pattern, text, re.IGNORECASE):
            found.append(skill)
        #if skill.lower() in lower_text:
         #   found.append(skill)

    return found

# Parse the resume and extract relevant information
def parse_resume(file_path: str):

    text = extract_resume_text(file_path)

    return {

        "full_name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "skills": extract_skills(text),

        "raw_text": text,

    }