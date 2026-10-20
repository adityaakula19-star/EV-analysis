from app.services.rag_service import (
    load_literature_docx,
    load_papers_xlsx,
    initialize_vector_db,
    retrieve_relevant_chunks,
)
from app.config import settings


def test_rag_docx_loading():
    chunks = load_literature_docx(settings.literature_path)
    assert len(chunks) > 0
    first = chunks[0]
    assert first["source"] == "Literature_Review_and_Metadata.docx"
    assert "section" in first
    assert "chunk_id" in first


def test_rag_xlsx_loading():
    chunks = load_papers_xlsx(settings.papers_path)
    assert len(chunks) > 0
    first = chunks[0]
    assert first["source"] == "EV_Adoption_Research_Papers_Comparison.xlsx"
    assert "paper" in first
    assert "authors" in first
    assert "page_or_row" in first


def test_vector_db_and_retrieval():
    store = initialize_vector_db()
    assert len(store["chunks"]) > 0
    assert store["faiss_index"] is not None

    retrieved = retrieve_relevant_chunks("What are the key drivers for EV adoption in India?", top_k=3)
    assert len(retrieved) > 0
    for chunk in retrieved:
        assert "chunk_id" in chunk
        assert "source" in chunk
        assert "text" in chunk
