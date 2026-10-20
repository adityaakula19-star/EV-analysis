from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes_chat import router as chat_router
from app.api.routes_analytics import router as analytics_router
from app.services.data_service import get_dataset_summary_stats

app = FastAPI(
    title="EV Adoption Intelligence System API",
    version="1.0.0",
    description="Backend API powering RAG & evidence-grounded EV adoption insights.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(analytics_router)


@app.get("/api/health")
def health() -> dict:
    try:
        stats = get_dataset_summary_stats()
        dataset_status = True
        record_count = stats["total_records"]
    except Exception as exc:
        dataset_status = False
        record_count = 0

    return {
        "status": "ok",
        "dataset_loaded": dataset_status,
        "cleaned_records_count": record_count,
        "llm_enabled": settings.llm_enabled,
        "llm_api_key_configured": bool(settings.llm_api_key),
        "llm_model": settings.llm_model,
    }
