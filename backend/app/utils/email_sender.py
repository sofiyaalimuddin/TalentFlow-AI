import os
import smtplib

from email.message import EmailMessage


EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_offer_email(
    candidate_email: str,
    candidate_name: str,
    pdf_bytes: bytes,
):
    message = EmailMessage()

    message["Subject"] = (
        "Offer Letter - TalentFlow Technologies Pvt. Ltd."
    )

    message["From"] = EMAIL_ADDRESS

    message["To"] = candidate_email

    message.set_content(
        f"""
Dear {candidate_name},

Congratulations!

We are pleased to inform you that you have been selected to join TalentFlow AI.

Your Offer Letter is attached to this email.

If you have any questions regarding your onboarding process, documents, office timings, joining date, leave policy, or HR-related queries, you can chat with our AI Onboarding Assistant using the link below:

https://talentflow-ai-1.onrender.com/chatbot

(After deployment, this link will be accessible from any device.)

We look forward to welcoming you to our team.

Regards,

TalentFlow AI HR Team
talentflow.ai.hr@gmail.com
"""
    )

    message.add_attachment(
        pdf_bytes,
        maintype="application",
        subtype="pdf",
        filename=f"Offer_Letter_{candidate_name}.pdf",
    )

    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465,
    ) as smtp:

        smtp.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD,
        )

        smtp.send_message(message)
