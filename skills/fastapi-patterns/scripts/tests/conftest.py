# tests/conftest.py — SQLite em memória + override de get_db + client + user/token fixtures
# Extraído de SKILL.md (2026-09-09).
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.database import Base
from app.dependencies import get_db
from app.main import create_app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL)
TestingSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session():
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(db_session: AsyncSession):
    app = create_app()

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest_asyncio.fixture
async def registered_user(client: AsyncClient) -> dict:
    resp = await client.post("/users/", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "securepass1",
        "password_confirm": "securepass1",
    })
    assert resp.status_code == 201
    return resp.json()


@pytest_asyncio.fixture
async def auth_token(client: AsyncClient, registered_user: dict) -> str:
    resp = await client.post("/users/token", data={
        "username": "test@example.com",
        "password": "securepass1",
    })
    assert resp.status_code == 200
    return resp.json()["access_token"]


@pytest_asyncio.fixture
async def auth_client(client: AsyncClient, auth_token: str) -> AsyncClient:
    client.headers.update({"Authorization": f"Bearer {auth_token}"})
    return client
