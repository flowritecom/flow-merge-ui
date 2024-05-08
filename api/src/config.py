import os
import threading


class ApplicationConfig:
    app_env: str
    cors_allowed_origins: str
    db_name: str
    output_dir: str
    hf_api_key: str


_config = None
_lock = threading.Lock()


def get_config() -> ApplicationConfig:
    global _config
    if _config is not None:
        return _config

    with _lock:
        _config = ApplicationConfig()
        _config.app_env = os.environ.get("LLM_LAB_APP_ENV", "development")
        _config.cors_allowed_origins = os.environ.get("LLM_LAB_CORS_ALLOWED_ORIGINS", "http://localhost:3000")
        _config.db_name = os.environ.get("LLM_LAB_DB_NAME", "db.sqlite")
        _config.output_dir = os.environ.get("LLM_LAB_OUTPUT_DIR", "output/")
        _config.hf_api_key = os.environ.get("LLM_LAB_HF_API_KEY")

    return _config
