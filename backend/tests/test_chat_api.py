from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["dataset_loaded"] is True
    assert data["cleaned_records_count"] == 10304


def test_chat_endpoint_country_comparison():
    payload = {"question": "Compare EV adoption between India and Germany"}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "answer" in data
    assert "evidence" in data
    assert "sources" in data
    assert "analysis" in data

    assert data["analysis"]["question_type"] == "country_comparison"
    assert "India" in data["analysis"]["countries"]
    assert "Germany" in data["analysis"]["countries"]

    # Verify sources carrying rich metadata
    assert len(data["sources"]) > 0
    first_src = data["sources"][0]
    assert "source" in first_src
    assert "chunk_id" in first_src


def test_chat_endpoint_empty_question():
    payload = {"question": "   "}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 422 or response.status_code == 200
