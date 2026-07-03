from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats():
    return {
        "total_jobs": 0,
        "total_candidates": 0,
        "pending_onboarding": 0,
        "top_candidate": "None"
    }