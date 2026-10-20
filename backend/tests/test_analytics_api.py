# pyrefly: ignore[missing-import]
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_analytics_overview():
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] == 10304
    assert "total_ev_sales" in data
    assert "global_ev_penetration_pct" in data


def test_analytics_country_trends():
    response = client.get("/api/analytics/country-trends")
    assert response.status_code == 200
    data = response.json()
    assert "India" in data
    assert "China" in data
    assert len(data["India"]) == 3


def test_analytics_correlations():
    response = client.get("/api/analytics/correlations")
    assert response.status_code == 200
    data = response.json()
    assert "corr_penetration_vs_charging" in data
    assert "corr_penetration_vs_price" in data


def test_analytics_categories():
    response = client.get("/api/analytics/categories?country=India&year=2025")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "vehicle_category" in data[0]


def test_analytics_dataset_sample():
    response = client.get("/api/analytics/dataset-sample?page=1&limit=10&country=Germany")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["limit"] == 10
    assert len(data["records"]) <= 10
    assert data["records"][0]["country"] == "Germany"


def test_analytics_monthly_trends():
    response = client.get("/api/analytics/country-trends?granularity=monthly")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 192  # 32 months * 6 countries


def test_analytics_compare():
    response = client.get("/api/analytics/compare?country_a=India&country_b=Germany&year=2025")
    assert response.status_code == 200
    data = response.json()
    assert "penetration_diff_pp" in data
    assert "ev_sales_diff" in data
    assert data["higher_penetration_country"] in ["India", "Germany"]


def test_analytics_research():
    response = client.get("/api/analytics/research")
    assert response.status_code == 200
    data = response.json()
    assert "themes" in data
    assert "papers" in data
    assert len(data["papers"]) == 15

