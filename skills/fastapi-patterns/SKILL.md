---
name: fastapi-patterns
description: "Use when fastAPI best practices covering project structure, Pydantic v2 schemas, dependency injection, async handlers, authentication, authorization, transactional service layers, and testing with httpx and pytest. Triggers on \"fastapi-patterns\", \"fastapi patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# FastAPI Patterns

Modern, production-grade FastAPI development: layout, Pydantic v2, DI, async, auth, transactional services, testing. Scaffold pronto em `scripts/` (copie `app/` + `tests/`).

## When to Activate

- Scaffolding or restructuring a FastAPI project (routers, services, schemas)
- Pydantic v2 schemas, `Annotated` dependencies, JWT auth, transactional services
- Async SQLAlchemy patterns or httpx/pytest test setup

## When NOT to Use

- Django/Flask projects (use `django-patterns`)
- Frontend work (use `frontend-patterns`)

## Project Structure

```
my_app/
|-- app/
|   |-- main.py               # App factory, lifespan, middleware
|   |-- config.py             # Settings via pydantic-settings
|   |-- dependencies.py       # Shared FastAPI dependencies
|   |-- database.py           # SQLAlchemy engine + session
|   |-- routers/users.py      # Thin routes → services
|   |-- models/user.py        # SQLAlchemy ORM models
|   |-- schemas/user.py       # Pydantic request/response
|   `-- services/user_service.py  # Business logic (transactional)
|-- tests/conftest.py         # SQLite mem + fixtures
|-- pyproject.toml `-- .env
```

## Modules (resumo — código em `scripts/`)

- **`app/main.py`**: `create_app()` + `lifespan` (create_all em dev; Alembic em prod; dispose no shutdown) + CORS por settings + `include_router`
- **`app/config.py`**: `BaseSettings` (.env, utf-8); secrets obrigatórios (`database_url`, `secret_key`); listas mutáveis avaliadas com segurança na v2
- **`app/schemas/user.py`**: Base/Create (`password`+`password_confirm` com `@model_validator`) /Update (tudo opcional) /Response (`from_attributes`) /List (total+items)
- **`app/dependencies.py`**: `get_db` (rollback seguro) → `get_current_user` (JWT + `sub`→int + 401) → `get_current_active_user` (403 se inativo); aliases `DbDep`/`CurrentUserDep`/`ActiveUserDep`
- **`app/routers/users.py`**: rotas finas — CRUD + `/me` + `/token`; erros de domínio → 400/403/404; `response_model` sempre tipado (anti-vazamento PII)
- **`app/services/user_service.py`**: bcrypt, `IntegrityError`→`DuplicateUserError` (exige índice unique no banco!), paginação com `order_by(id)`, `exclude_unset` no update, JWT com `exp`
- **`tests/conftest.py`**: SQLite `:memory:` + create/drop por teste + override `get_db` + `client`/`registered_user`/`auth_token`/`auth_client` fixtures

## Anti-Patterns

```python
# BAD: lógica de negócio na rota / sync bloqueando o loop
@router.post("/users/")
async def create_user(payload: UserCreate, db: DbDep):
    user = User(email=payload.email, hashed_password=bcrypt.hash(payload.password))
    db.add(user); await db.commit(); return user            # sem validação de duplicata!

# GOOD: rota fina, service transacional (ver scripts/app/services/user_service.py)
```

- Sync DB calls (`db.query(...)`) em rotas async → sempre `await db.execute(select(...))` com `AsyncSession`

## Best Practices
