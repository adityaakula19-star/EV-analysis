from app.services.data_service import (
    load_cleaned_dataset,
    get_dataset_summary_stats,
    compute_country_year_metrics,
    compute_comparison,
    compute_country_trend,
    compute_statistical_correlations,
    compute_rankings,
)


def test_cleaned_dataset_count():
    df = load_cleaned_dataset()
    # User requirement: Cleaned dataset MUST have exactly 10,304 records
    assert len(df) == 10304, f"Expected 10,304 cleaned records, got {len(df)}"


def test_dataset_summary_stats():
    stats = get_dataset_summary_stats()
    assert stats["total_records"] == 10304
    assert len(stats["countries"]) == 6
    assert stats["years"] == [2024, 2025, 2026]


def test_country_year_metrics():
    m = compute_country_year_metrics("India", 2025)
    assert m is not None
    assert m["country"] == "India"
    assert m["year"] == 2025
    assert m["ev_units_sold"] > 0
    assert m["ev_penetration_pct"] >= 0.0


def test_compute_comparison():
    comp = compute_comparison("India", "Germany", 2025)
    assert comp is not None
    assert comp["year"] == 2025
    assert "penetration_diff_pp" in comp
    assert "ev_sales_diff" in comp
    assert comp["higher_penetration_country"] in ["India", "Germany"]


def test_compute_trend():
    trends = compute_country_trend("China")
    assert len(trends) > 0
    assert any("yoy_ev_sales_growth_pct" in item for item in trends[1:])


def test_statistical_correlations():
    corrs = compute_statistical_correlations()
    assert "corr_penetration_vs_charging" in corrs
    assert "corr_penetration_vs_price" in corrs
    assert -1.0 <= corrs["corr_penetration_vs_charging"] <= 1.0


def test_rankings():
    ranks = compute_rankings(2025)
    assert len(ranks) == 6
    assert ranks[0]["rank"] == 1
    assert ranks[0]["ev_penetration_pct"] >= ranks[1]["ev_penetration_pct"]
