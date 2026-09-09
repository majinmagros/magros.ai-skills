# config.py — Env-driven config (no hardcoded paths)
# Extraído de SKILL.md (2026-09-09). Coloque em tests/config.py
import os
APP_PATH          = os.environ.get("APP_PATH", "")           # set via env — no default path
MAIN_WINDOW_TITLE = os.environ.get("APP_TITLE", "")
LAUNCH_TIMEOUT    = int(os.environ.get("LAUNCH_TIMEOUT", "15"))
ACTION_TIMEOUT    = int(os.environ.get("ACTION_TIMEOUT", "10"))
ARTIFACT_DIR      = os.path.join(os.path.dirname(__file__), "artifacts")
