from io import BytesIO
from annotated_types import doc
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)

styles = getSampleStyleSheet()

title_style = styles["Heading1"]
title_style.alignment = TA_CENTER
title_style.textColor = HexColor("#1565C0")

heading_style = styles["Heading2"]
heading_style.textColor = HexColor("#1565C0")

normal_style = styles["BodyText"]

# Offer letter generation function
def generate_offer_letter(data):
        buffer = BytesIO()

        doc = SimpleDocTemplate(buffer)

        story = []

        story.append(
                Paragraph(
                    "TalentFlow Technologies Pvt. Ltd.",
                    title_style,
                )
            )       

        story.append(
                Paragraph(
                    "Powered by TalentFlow AI",
                    heading_style,
                )
            )       

        story.append(Spacer(1, 20))     

        story.append(
                Paragraph(
                    "<b>OFFER LETTER</b>",
                    title_style,
                )
            )       

        story.append(Spacer(1, 30))

        # Add candidate details
        candidate = data["candidate"]
        job = data["job"]
        application = data["application"]

        story.append(
        Paragraph(
            f"<b>Candidate Name:</b> {candidate.full_name}",
            normal_style,
        )
    )

        story.append(
        Paragraph(
            f"<b>Email:</b> {candidate.email}",
            normal_style,
        )
    )

        story.append(
        Paragraph(
            f"<b>Phone:</b> {candidate.phone}",
            normal_style,
        )
    )

        story.append(
        Paragraph(
            f"<b>Experience:</b> {candidate.experience}",
            normal_style,
        )
    )

        story.append(Spacer(1, 20))

# Add job details
        story.append(
        Paragraph(
            "<b>Job Details</b>",
            heading_style,
        )
    )

        story.append(
        Paragraph(
            f"<b>Position:</b> {job.title}",
            normal_style,
        )
    )

        story.append(
        Paragraph(
            f"<b>Department:</b> {job.department}",
            normal_style,
        )
    )

        story.append(
        Paragraph(
            f"<b>Match Score:</b> {application.match_score:.0f}%",
            normal_style,
        )
    )

        story.append(Spacer(1, 20))

# Add offer text
        story.append(
        Paragraph(
            f"""
            Dear <b>{candidate.full_name}</b>,<br/><br/>

            Congratulations!

            We are pleased to offer you the position of
            <b>{job.title}</b> at
            <b>TalentFlow Technologies Pvt. Ltd.</b>

            We look forward to having you as a valued member of our team.

            """,
            normal_style,
        )
    )

        story.append(Spacer(1, 25))

        story.append(
        Paragraph(
            "<b>Regards,</b>",
            normal_style,
        )
    )

        story.append(Spacer(1, 15))

        story.append(
        Paragraph(
            "HR Team",
            normal_style,
        )
    )

        story.append(
        Paragraph(
            "TalentFlow Technologies Pvt. Ltd.",
            normal_style,
        )
    )

        doc.build(story)

        pdf = buffer.getvalue()

        buffer.close()

        return pdf