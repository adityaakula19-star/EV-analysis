from fastapi import APIRouter
from app.models.request_models import ChatRequest, ChatResponse
from app.services.llm_service import process_chat_query

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    result = process_chat_query(request.question)
    return ChatResponse(**result)
