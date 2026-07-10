from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"],
)


class ChatRequest(BaseModel):
    message: str


@router.post("/")
def chat(request: ChatRequest):

    message = request.message.lower()

    if "hello" in message or "hi" in message:
        reply = (
            "Hello! Welcome to TalentFlow AI. "
            "How can I help you today?"
        )

    elif "document" in message:
        reply = (
            "Please bring your Aadhaar Card, PAN Card, "
            "Passport Size Photograph, Bank Passbook and "
            "Educational Certificates."
        )

    elif "joining" in message:
        reply = (
            "Your joining date will be communicated "
            "by the HR department through email."
        )

    elif "timing" in message or "office" in message:
        reply = (
            "Office timings are 9:00 AM to 5:00 PM "
            "from Monday to Friday."
        )

    elif "leave" in message:
        reply = (
            "Employees are entitled to casual, sick "
            "and earned leaves according to company policy."
        )

    elif "dress" in message:
        reply = (
            "Business casual attire is recommended "
            "for all employees."
        )

    elif "contact" in message or "hr" in message:
        reply = (
            "You can contact the HR department at "
            "talentflow.ai.hr@gmail.com."
        )

    else:
        reply = (
            "Sorry, I couldn't understand your question. "
            "Please ask about onboarding, documents, office timings, "
            "joining date, leave policy or HR contact."
        )

    return {
        "reply": reply
    }