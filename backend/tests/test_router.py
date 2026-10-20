from app.services.router_service import classify_question, extract_countries, extract_years


def test_country_extraction():
    assert "India" in extract_countries("What about India and Germany?")
    assert "Germany" in extract_countries("What about India and Germany?")
    assert "USA" in extract_countries("Compare United States and UK")
    assert "UK" in extract_countries("Compare United States and UK")
    assert "China" in extract_countries("EV sales in PRC")
    assert "Norway" in extract_countries("Norway EV adoption rate")


def test_year_extraction():
    assert extract_years("Sales in 2024 and 2025") == [2024, 2025]
    assert extract_years("No year mentioned") == [2024, 2025, 2026]


def test_router_classification_types():
    # 1. Country comparison
    q_type, countries, _ = classify_question("Compare EV adoption between India and Germany")
    assert q_type == "country_comparison"
    assert "India" in countries
    assert "Germany" in countries

    # 2. Trend analysis
    q_type, countries, _ = classify_question("How has EV adoption changed over time in China?")
    assert q_type == "trend_analysis"
    assert "China" in countries

    # 3. Factor analysis
    q_type, countries, _ = classify_question("What factors and subsidies drive EV adoption in Norway?")
    assert q_type == "factor_analysis"
    assert "Norway" in countries

    # 4. Statistical questions
    q_type, _, _ = classify_question("What is the correlation between charging stations and EV penetration?")
    assert q_type == "statistical_questions"

    # 5. General EV questions
    q_type, _, _ = classify_question("Overview of global electric vehicle adoption")
    assert q_type == "general_ev_questions"
