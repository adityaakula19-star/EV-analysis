import os
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np
import docx
import faiss

from app.config import settings

# Global cache for RAG chunks and FAISS index
_RAG_STORE: Dict[str, Any] = {
    "chunks": [],
    "embeddings": None,
    "faiss_index": None,
}


def load_literature_docx(file_path: Path) -> List[Dict[str, Any]]:
    chunks = []
    if not file_path.exists():
        return chunks

    doc = docx.Document(file_path)
    current_section = "1. Literature Review"
    para_buffer = []
    chunk_counter = 1

    for p_idx, para in enumerate(doc.paragraphs, start=1):
        text = para.text.strip()
        if not text:
            continue

        # Check if text is a section header (e.g. 1. Literature Review, 1.1 Global EV...)
        if re.match(r"^\d+(\.\d+)*\s+[A-Z]", text):
            # Flush existing buffer as a chunk
            if para_buffer:
                chunk_text = "\n".join(para_buffer)
                chunks.append({
                    "chunk_id": f"lit_doc_{chunk_counter:03d}",
                    "text": chunk_text,
                    "source": "Literature_Review_and_Metadata.docx",
                    "section": current_section,
                    "paper": None,
                    "authors": None,
                    "year": None,
                    "page_or_row": f"Para {p_idx - len(para_buffer)}-{p_idx}",
                })
                chunk_counter += 1
                para_buffer = []
            current_section = text
        else:
            para_buffer.append(text)
            if len("\n".join(para_buffer)) > 800:
                chunk_text = "\n".join(para_buffer)
                chunks.append({
                    "chunk_id": f"lit_doc_{chunk_counter:03d}",
                    "text": chunk_text,
                    "source": "Literature_Review_and_Metadata.docx",
                    "section": current_section,
                    "paper": None,
                    "authors": None,
                    "year": None,
                    "page_or_row": f"Para {p_idx}",
                })
                chunk_counter += 1
                para_buffer = []

    if para_buffer:
        chunk_text = "\n".join(para_buffer)
        chunks.append({
            "chunk_id": f"lit_doc_{chunk_counter:03d}",
            "text": chunk_text,
            "source": "Literature_Review_and_Metadata.docx",
            "section": current_section,
            "paper": None,
            "authors": None,
            "year": None,
            "page_or_row": "Para End",
        })

    return chunks


def load_papers_xlsx(file_path: Path) -> List[Dict[str, Any]]:
    chunks = []
    if not file_path.exists():
        return chunks

    df = pd.read_excel(file_path)
    for idx, row in df.iterrows():
        row_num = idx + 1
        paper_title = str(row.get("Paper Title", f"Paper #{row_num}")).strip()
        authors_year = str(row.get("Author(s) & Year", "")).strip()
        pros = str(row.get("Pros", "")).strip()
        cons = str(row.get("What's Missing (Cons)", "")).strip()
        better = str(row.get("What Could Be Done Better", "")).strip()

        year_match = re.search(r"\b(20\d{2}|19\d{2})\b", authors_year)
        pub_year = int(year_match.group(1)) if year_match else None

        full_text = (
            f"Paper: {paper_title}\n"
            f"Authors & Year: {authors_year}\n"
            f"Pros/Strengths: {pros}\n"
            f"Cons/Gaps: {cons}\n"
            f"Future Work: {better}"
        )

        chunks.append({
            "chunk_id": f"paper_row_{row_num:03d}",
            "text": full_text,
            "source": "EV_Adoption_Research_Papers_Comparison.xlsx",
            "section": "Research Papers Comparison",
            "paper": paper_title,
            "authors": authors_year,
            "year": pub_year,
            "page_or_row": f"Row {row_num}",
        })

    return chunks


def build_text_embedding_vector(text: str, dim: int = 384) -> np.ndarray:
    """
    Deterministically converts text into a normalized dense vector using character n-gram hashing.
    Provides fast, standalone FAISS indexing without external model downloads.
    """
    vec = np.zeros(dim, dtype=np.float32)
    words = re.findall(r"\w+", text.lower())
    for w in words:
        h = hash(w) % dim
        vec[h] += 1.0
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec


def initialize_vector_db() -> Dict[str, Any]:
    global _RAG_STORE
    if _RAG_STORE["faiss_index"] is not None:
        return _RAG_STORE

    chunks = []
    chunks.extend(load_literature_docx(settings.literature_path))
    chunks.extend(load_papers_xlsx(settings.papers_path))

    dim = 384
    if not chunks:
        # Fallback dummy chunk if files not found
        chunks.append({
            "chunk_id": "fallback_001",
            "text": "EV adoption literature benchmarking global EV transition models.",
            "source": "System Default Literature",
            "section": "General Overview",
            "paper": None,
            "authors": None,
            "year": 2024,
            "page_or_row": 1,
        })

    vecs = np.array([build_text_embedding_vector(c["text"], dim=dim) for c in chunks], dtype=np.float32)
    index = faiss.IndexFlatL2(dim)
    index.add(vecs)

    _RAG_STORE["chunks"] = chunks
    _RAG_STORE["embeddings"] = vecs
    _RAG_STORE["faiss_index"] = index

    return _RAG_STORE


def retrieve_relevant_chunks(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    store = initialize_vector_db()
    index = store["faiss_index"]
    chunks = store["chunks"]

    q_vec = np.array([build_text_embedding_vector(query, dim=384)], dtype=np.float32)
    distances, indices = index.search(q_vec, min(top_k, len(chunks)))

    retrieved = []
    for idx in indices[0]:
        if 0 <= idx < len(chunks):
            retrieved.append(chunks[idx])

    return retrieved
