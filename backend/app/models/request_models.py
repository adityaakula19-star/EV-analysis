from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, json_schema_extra={"example": "Compare EV adoption between India and Germany"})


class SourceItem(BaseModel):
    source: str
    section: Optional[str] = None
    paper: Optional[str] = None
    authors: Optional[str] = None
    year: Optional[Any] = None
    page_or_row: Optional[Any] = None
    chunk_id: str


class ChatResponse(BaseModel):
    answer: str
    evidence: List[str]
    sources: List[SourceItem]
    analysis: Dict[str, Any]
