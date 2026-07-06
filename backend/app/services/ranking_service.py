import re

def normalize_skills(skills: str):
    if not skills:
        return set()

    return {
        skill.strip().lower()
        for skill in re.split(r"[,\n]", skills)
        if skill.strip()
    }


def calculate_match_score(job_skills: str, candidate_skills: str):
    job = normalize_skills(job_skills)
    candidate = normalize_skills(candidate_skills)

    if not job:
        return {
            "score": 0,
            "matched_skills": "",
            "missing_skills": "",
        }

    matched = job.intersection(candidate)
    missing = job - candidate

    score = round((len(matched) / len(job)) * 100)

    return {
        "score": score,
        "matched_skills": ", ".join(sorted(matched)),
        "missing_skills": ", ".join(sorted(missing)),
    }