from typing import Dict, Any, List
import httpx

from app.config import settings
from app.prompts.system_prompt import SYSTEM_PROMPT
from app.services.router_service import classify_question
from app.services.data_service import calculate_backend_evidence
from app.services.rag_service import retrieve_relevant_chunks


def format_user_prompt(question: str, question_type: str, evidence: List[str], rag_chunks: List[Dict[str, Any]]) -> str:
    ev_text = "\n".join(f"- {e}" for e in evidence) if evidence else "- No dataset metrics retrieved."
    
    rag_text_items = []
    for c in rag_chunks:
        meta_str = f"[Source: {c['source']}"
        if c.get("section"):
            meta_str += f" | Section: {c['section']}"
        if c.get("paper"):
            meta_str += f" | Paper: {c['paper']}"
        if c.get("authors"):
            meta_str += f" | Authors: {c['authors']}"
        if c.get("page_or_row"):
            meta_str += f" | Location: {c['page_or_row']}"
        meta_str += f" | ID: {c['chunk_id']}]"
        rag_text_items.append(f"{meta_str}\n{c['text']}")

    rag_text = "\n\n".join(rag_text_items) if rag_text_items else "- No literature retrieved."

    return (
        f"Question Classification: {question_type}\n\n"
        f"User Question:\n{question}\n\n"
        f"Dataset Evidence from Backend (AUTHORITATIVE PRE-CALCULATED NUMBERS):\n{ev_text}\n\n"
        f"Retrieved Literature Context:\n{rag_text}\n\n"
        "Please generate a complete response following all rules in the system prompt."
    )


def call_llm(user_prompt: str) -> str:
    if not settings.llm_api_key:
        raise ValueError("LLM_API_KEY is not configured in backend/.env")

    url = f"{settings.llm_base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.llm_model,
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    }

    with httpx.Client(timeout=settings.llm_timeout_seconds) as client:
        res = client.post(url, headers=headers, json=payload)
    
    if res.status_code >= 400:
        raise RuntimeError(f"LLM API request failed (HTTP {res.status_code}): {res.text[:400]}")

    data = res.json()
    try:
        content = data["choices"][0]["message"]["content"]
        return content.strip()
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError(f"Unexpected response shape from LLM API: {data}") from exc


def build_offline_fallback_answer(question: str, question_type: str, evidence: List[str], rag_chunks: List[Dict[str, Any]]) -> str:
    ev_summary = "\n".join(f"- {e}" for e in evidence[:4])
    src_summary = "\n".join(f"- {c['source']} ({c['chunk_id']}): {c.get('section') or c.get('paper') or ''}" for c in rag_chunks[:3])

    return (
        f"Direct Answer\n"
        f"Backend analysis completed successfully for query: '{question}' (Question Type: {question_type}). "
        f"LLM generation is currently running in offline test mode (LLM_ENABLED=false or API key unset).\n\n"
        f"Key Findings\n"
        f"- All numerical metrics were pre-calculated deterministically using Python/Pandas on the cleaned dataset.\n"
        f"- Retrieved {len(rag_chunks)} literature reference chunks carrying rich source metadata.\n\n"
        f"Comparison / Analytical Breakdown\n"
        f"Primary dataset evidence compiled by backend:\n{ev_summary}\n\n"
        f"Evidence\n"
        f"{ev_summary}\n\n"
        f"Sources\n"
        f"- Cleaned EV Adoption Dataset (10,304 records)\n"
        f"{src_summary}\n\n"
        f"Limitations\n"
        f"- Offline fallback mode active. Enable LLM_ENABLED=true and set LLM_API_KEY in backend/.env for full natural language synthesis."
    )


def process_chat_query(question: str) -> Dict[str, Any]:
    cleaned_q = (question or "").strip()
    if not cleaned_q:
        return {
            "answer": "Please provide a valid, non-empty question.",
            "evidence": [],
            "sources": [],
            "analysis": {
                "question_type": "invalid",
                "countries": [],
                "years": [],
                "llm_used": False,
                "model": settings.llm_model,
                "error": "empty_question",
            },
        }

    question_type, countries, years = classify_question(cleaned_q)
    evidence, analysis_meta = calculate_backend_evidence(question_type, countries, years)
    rag_chunks = retrieve_relevant_chunks(cleaned_q, top_k=3)

    sources = []
    # Dataset source item
    sources.append({
        "source": "EV_Adoption_Dataset_Recleaned.xlsx",
        "section": "Cleaned_Data Sheet",
        "paper": None,
        "authors": None,
        "year": "2024-2026",
        "page_or_row": "10,304 rows",
        "chunk_id": "dataset_cleaned_data",
    })
    
    # RAG source items
    for chunk in rag_chunks:
        sources.append({
            "source": chunk["source"],
            "section": chunk.get("section"),
            "paper": chunk.get("paper"),
            "authors": chunk.get("authors"),
            "year": chunk.get("year"),
            "page_or_row": chunk.get("page_or_row"),
            "chunk_id": chunk["chunk_id"],
        })

    llm_used = False
    error_msg = None
    answer_text = ""

    if settings.llm_enabled and settings.llm_api_key:
        try:
            prompt = format_user_prompt(cleaned_q, question_type, evidence, rag_chunks)
            answer_text = call_llm(prompt)
            llm_used = True
        except Exception as exc:
            error_msg = str(exc)
            answer_text = build_offline_fallback_answer(cleaned_q, question_type, evidence, rag_chunks)
    else:
        answer_text = build_offline_fallback_answer(cleaned_q, question_type, evidence, rag_chunks)

    analysis_meta["llm_used"] = llm_used
    analysis_meta["model"] = settings.llm_model
    analysis_meta["error"] = error_msg

    return {
        "answer": answer_text,
        "evidence": evidence,
        "sources": sources,
        "analysis": analysis_meta,
    }
