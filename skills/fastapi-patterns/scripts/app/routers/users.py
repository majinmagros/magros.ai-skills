# app/routers/users.py — Rotas finas: delegam tudo ao UserService, mapeiam erros de domínio
# Extraído de SKILL.md (2026-09-09).
from typing import Annotated
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies import ActiveUserDep, DbDep
from app.schemas.user import UserCreate, UserResponse, UserUpdate, UserListResponse
from app.services.user_service import DuplicateUserError, UserService

router = APIRouter()


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, db: DbDep) -> UserResponse:
    service = UserService(db)
    try:
        return await service.create(payload)
    except DuplicateUserError:
        raise HTTPException(status_code=400, detail="Email already registered")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: ActiveUserDep) -> UserResponse:
    return current_user


@router.get("/", response_model=UserListResponse)
async def list_users(
    db: DbDep,
    current_user: ActiveUserDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> UserListResponse:
    service = UserService(db)
    users, total = await service.list(skip=skip, limit=limit)
    return UserListResponse(total=total, items=users)


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    payload: UserUpdate,
    db: DbDep,
    current_user: ActiveUserDep,
) -> UserResponse:
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    service = UserService(db)
    try:
        user = await service.update(user_id, payload)
    except DuplicateUserError:
        raise HTTPException(status_code=400, detail="Email already registered")
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DbDep,
) -> dict[str, str]:
    service = UserService(db)
    token = await service.authenticate(form_data.username, form_data.password)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": token, "token_type": "bearer"}
