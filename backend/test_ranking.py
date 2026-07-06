from app.services.ranking_service import calculate_match_score

result = calculate_match_score(
    "Python, FastAPI, SQL, React",
    "Python, SQL, Git, React",
)

print(result)