import re
from typing import List, Tuple

COUNTRY_ALIASES = {
    "india": "India",
    "bharat": "India",
    "china": "China",
    "prc": "China",
    "germany": "Germany",
    "deutschland": "Germany",
    "norway": "Norway",
    "norge": "Norway",
    "uk": "UK",
    "united kingdom": "UK",
    "britain": "UK",
    "england": "UK",
    "usa": "USA",
    "us": "USA",
    "united states": "USA",
    "america": "USA",
}

ALL_COUNTRIES = ["China", "Germany", "India", "Norway", "UK", "USA"]
VALID_YEARS = [2024, 2025, 2026]


def extract_countries(text: str) -> List[str]:
    lowered = text.lower()
    found: List[str] = []
    for alias, canonical in sorted(COUNTRY_ALIASES.items(), key=lambda item: len(item[0]), reverse=True):
        pattern = r"\b" + re.escape(alias) + r"\b"
        if re.search(pattern, lowered) and canonical not in found:
            found.append(canonical)
    return found


def extract_years(text: str) -> List[int]:
    found = [int(token) for token in re.findall(r"\b(20\d{2})\b", text) if int(token) in VALID_YEARS]
    unique: List[int] = []
    for yr in found:
        if yr not in unique:
            unique.append(yr)
    return unique or VALID_YEARS


def classify_question(text: str) -> Tuple[str, List[str], List[int]]:
    lowered = (text or "").lower()
    countries = extract_countries(lowered)
    years = extract_years(lowered)

    # Statistical questions override (e.g. correlation, relationship, regression)
    if any(word in lowered for word in ["correlat", "statistical", "regression", "covariance"]):
        question_type = "statistical_questions"
    # Country comparison
    elif len(countries) >= 2 or any(word in lowered for word in ["compare", "versus", " vs ", "vs.", "difference between"]):
        question_type = "country_comparison"
    # Trend analysis
    elif any(word in lowered for word in ["trend", "growth", "over time", "changed", "timeline", "progression", "historical"]):
        question_type = "trend_analysis"
    # Factor analysis
    elif any(word in lowered for word in ["factor", "driver", "barrier", "why", "influence", "affect", "reason", "subsidy", "policy"]):
        question_type = "factor_analysis"
    else:
        question_type = "general_ev_questions"

    return question_type, countries, years
