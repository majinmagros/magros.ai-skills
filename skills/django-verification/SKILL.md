---
name: django-verification
description: "Use when verification loop for Django projects: migrations, linting, tests with coverage, security scans, and deployment readiness checks before release or PR. Only for Django — not for other stacks. Triggers on \"django-verification\", \"django verification\", \"verification\"."
metadata:
  origin: ECC
---

# Django Verification Loop

Run before PRs, after major changes, and pre-deploy. Phases 1–12 in `references/`, automation in `scripts/verify.sh`, CI in `references/ci.yml`, report in `references/report-template.md`.

## When to Activate

- Before opening a pull request for a Django project
- After major model changes, migration updates, or dependency upgrades
- Pre-deployment verification for staging or production
- Running full environment → lint → test → security → deploy readiness pipeline
- Validating migration safety and test coverage

## Phases (resumo)

| # | Phase | Gate |
|---|---|---|
| 1 | **Environment** (python version, venv, env vars) | configured |
| 2 | **Lint** (mypy, ruff, black, isort, `manage.py check --deploy`) | clean |
| 3 | **Migrations** (showmigrations, makemigrations --check, migrate --plan) | none pending, no conflicts |
| 4 | **Tests** (pytest + coverage ≥80%: models 90, serializers 85, views 80, services 90) | all green |
| 5 | **Security** (pip-audit, safety, bandit, gitleaks, `check --deploy`) | no vulns, DEBUG False |
| 6 | **Commands** (check, collectstatic, superuser, DB integrity, cache) | all ok |
| 7 | **Performance** (N+1 via toolbar, indexes, <50 queries/page) | acceptable |
| 8 | **Assets** (npm audit, build, findstatic) | collected |
| 9 | **Config** (DEBUG False, SECRET_KEY 30+, ALLOWED_HOSTS, HTTPS/HSTS, non-sqlite DB) | valid |
| 10 | **Logging** (warning/error emit, writable log files) | working |
| 11 | **API docs** (generateschema, valid JSON, Swagger UI) | current |
| 12 | **Diff** (no print/pdb/`DEBUG=True`, no TODOs, no secrets, migrations included) | clean |

```bash
./scripts/verify.sh   # fases 1–5 automatizadas
```

## Pre-Deployment Checklist (resumo)

Tests green + coverage ≥80% · no vulns · no pending migrations · DEBUG False · SECRET_KEY + ALLOWED_HOSTS · backups on · static collected · logging + Sentry · CDN/cache/Celery/HTTPS/env documented as applicable.

## Quick Reference

| Check | Command |
|-------|---------|
| Environment | `python --version` |
| Type checking | `mypy .` |
| Linting | `ruff check .` |
| Formatting | `black . --check` |
| Migrations | `python manage.py makemigrations --check` |
| Tests | `pytest --cov=apps` |
| Security | `pip-audit && bandit -r .` |
| Django check | `python manage.py check --deploy` |
| Collectstatic | `python manage.py collectstatic --noinput` |
| Diff stats | `git diff --stat` |

Remember: Automated verification catches common issues but doesn't replace manual code review and testing in staging environment.
