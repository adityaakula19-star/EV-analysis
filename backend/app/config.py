import os
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")


def _env(name: str, default: str = "") -> str:
    value = os.getenv(name)
    if value is None or value.strip() == "":
        return default
    return value.strip()


def _env_bool(name: str, default: bool = True) -> bool:
    val = os.getenv(name)
    if val is None or val.strip() == "":
        return default
    return val.strip().lower() in ("true", "1", "yes", "on")


class Settings:
    llm_enabled: bool
    llm_api_key: str
    llm_base_url: str
    llm_model: str
    llm_timeout_seconds: float
    dataset_path: Path
    literature_path: Path
    papers_path: Path

    def __init__(self) -> None:
        self.llm_enabled = _env_bool("LLM_ENABLED", True)
        self.llm_api_key = _env("LLM_API_KEY")
        self.llm_base_url = _env("LLM_BASE_URL", "https://api.openai.com/v1").rstrip("/")
        self.llm_model = _env("LLM_MODEL", "gpt-4o-mini")
        self.llm_timeout_seconds = float(_env("LLM_TIMEOUT_SECONDS", "60"))

        data_path = Path(_env("DATASET_PATH", "data/raw/EV_Adoption_Dataset_Recleaned.xlsx"))
        self.dataset_path = data_path if data_path.is_absolute() else BACKEND_DIR / data_path

        lit_path = Path(_env("LITERATURE_PATH", "data/docs/Literature_Review_and_Metadata.docx"))
        self.literature_path = lit_path if lit_path.is_absolute() else BACKEND_DIR / lit_path

        paper_path = Path(_env("PAPERS_PATH", "data/docs/EV_Adoption_Research_Papers_Comparison.xlsx"))
        self.papers_path = paper_path if paper_path.is_absolute() else BACKEND_DIR / paper_path


settings = Settings()
