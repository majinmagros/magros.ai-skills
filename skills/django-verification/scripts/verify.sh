#!/bin/bash
# verify.sh — Automated Django verification: env → lint → migrations → tests → security
# Extraído de SKILL.md (2026-09-09).
set -e

echo "=== Phase 1: Environment ==="
python --version
python manage.py check

echo "=== Phase 2: Lint ==="
ruff check . && black . --check && isort . --check-only && mypy .

echo "=== Phase 3: Migrations ==="
python manage.py makemigrations --check
python manage.py migrate --plan

echo "=== Phase 4: Tests + Coverage ==="
pytest --cov=apps --cov-report=term-missing --reuse-db

echo "=== Phase 5: Security ==="
pip-audit && bandit -r . -q && python manage.py check --deploy

echo "=== All Phases Complete ==="
