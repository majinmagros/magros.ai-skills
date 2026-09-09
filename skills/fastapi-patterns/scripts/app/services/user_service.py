# app/services/user_service.py — Lógica de negócio transacional (bcrypt, IntegrityError→domínio, JWT)
# Extraído de SKILL.md (2026-09-09).
# NOTA de design: o tratamento de unicidade exige índice unique no banco
# (ex.: `unique=True` no mapeamento SQLAlchemy). Sem constraint, o catch de
# IntegrityError não protege contra race conditions concorrentes.
from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class DuplicateUserError(Exception):
    """Raised when a unique user field conflicts with an existing row."""


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, payload: UserCreate) -> User:
        user = User(
            email=payload.email,
            username=payload.username,
            hashed_password=pwd_context.hash(payload.password),
        )
        self.db.add(user)
        try:
            # Rely on atomic DB constraints rather than race-prone application-level prechecks
            await self.db.commit()
        except IntegrityError as exc:
            await self.db.rollback()
            raise DuplicateUserError from exc
        await self.db.refresh(user)
        return user

    async def list(self, skip: int = 0, limit: int = 20) -> tuple[list[User], int]:
        total_result = await self.db.execute(select(func.count(User.id)))
        total = total_result.scalar_one()
        # Enforce explicit deterministic ordering to ensure reliable pagination
        result = await self.db.execute(
            select(User).order_by(User.id).offset(skip).limit(limit)
        )
        return list(result.scalars()), total

    async def update(self, user_id: int, payload: UserUpdate) -> User | None:
        user = await self.db.get(User, user_id)
        if user is None:
            return None
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(user, field, value)
        try:
            await self.db.commit()
        except IntegrityError as exc:
            await self.db.rollback()
            raise DuplicateUserError from exc
        await self.db.refresh(user)
        return user

    async def authenticate(self, email: str, password: str) -> str | None:
        user = await self.get_by_email(email)
        if user is None or not pwd_context.verify(password, user.hashed_password):
            return None
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        return jwt.encode(
            {"sub": str(user.id), "exp": expire},
            settings.secret_key,
            algorithm=settings.algorithm,
        )
