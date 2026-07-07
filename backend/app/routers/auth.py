from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, File, HTTPException, Request, Response, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext

from app.db import get_db
from app.logger import get_logger
from app.middleware.auth_middleware import (
    REFRESH_COOKIE_NAME,
    clear_auth_cookies,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    set_auth_cookies,
)
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UpdateProfileRequest,
    UserResponse,
)
from app.services.cloudinary_service import upload_avatar

logger = get_logger("auth_router")
router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _to_user_response(user: dict) -> UserResponse:
    created_at = user.get("created_at")
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat()
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        display_name=user["display_name"],
        avatar_url=user.get("avatar_url"),
        created_at=created_at or "",
        mood_streak=user.get("mood_streak", 0),
        total_entries=user.get("total_entries", 0),
    )


async def _issue_session(response: Response, user_id: str, db: AsyncIOMotorDatabase) -> None:
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)
    set_auth_cookies(response, access_token, refresh_token)
    await db.refresh_tokens.insert_one(
        {
            "user_id": ObjectId(user_id),
            "token": refresh_token,
            "revoked": False,
            "expires_at": datetime.now(timezone.utc).replace(microsecond=0),
        }
    )


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    payload: SignupRequest, response: Response, db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing = await db.users.find_one({"email": payload.email})
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    hashed_password = pwd_context.hash(payload.password)
    now = datetime.now(timezone.utc)
    doc = {
        "email": payload.email,
        "hashed_password": hashed_password,
        "display_name": payload.display_name,
        "avatar_url": None,
        "created_at": now,
        "last_login": now,
        "mood_streak": 0,
        "total_entries": 0,
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id

    await _issue_session(response, str(result.inserted_id), db)
    return _to_user_response(doc)


@router.post("/login", response_model=UserResponse)
async def login(
    payload: LoginRequest, response: Response, db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = await db.users.find_one({"email": payload.email})
    if user is None or not pwd_context.verify(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    await db.users.update_one(
        {"_id": user["_id"]}, {"$set": {"last_login": datetime.now(timezone.utc)}}
    )

    await _issue_session(response, str(user["_id"]), db)
    return _to_user_response(user)


@router.post("/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"message": "logged out"}


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return _to_user_response(current_user)


@router.post("/refresh")
async def refresh(
    request: Request,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    try:
        payload = decode_token(refresh_token)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    stored = await db.refresh_tokens.find_one(
        {"token": refresh_token, "revoked": False}
    )
    if stored is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not recognized")

    user_id = payload.get("sub")
    new_access_token = create_access_token(user_id)
    set_auth_cookies(response, new_access_token, refresh_token)
    return {"message": "refreshed"}


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    payload: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    await db.users.update_one(
        {"_id": current_user["_id"]}, {"$set": {"display_name": payload.display_name}}
    )
    updated = await db.users.find_one({"_id": current_user["_id"]})
    return _to_user_response(updated)


@router.post("/avatar")
async def upload_avatar_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    file_bytes = await file.read()
    try:
        url = await upload_avatar(file_bytes, str(current_user["_id"]))
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Avatar upload failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail="Avatar upload failed"
        ) from exc

    await db.users.update_one({"_id": current_user["_id"]}, {"$set": {"avatar_url": url}})
    return {"avatar_url": url}


@router.put("/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    if not pwd_context.verify(payload.current_password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect"
        )
    new_hashed = pwd_context.hash(payload.new_password)
    await db.users.update_one(
        {"_id": current_user["_id"]}, {"$set": {"hashed_password": new_hashed}}
    )
    return {"message": "password changed"}


@router.delete("/account")
async def delete_account(
    response: Response,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = current_user["_id"]
    await db.mood_entries.delete_many({"user_id": user_id})
    await db.refresh_tokens.delete_many({"user_id": user_id})
    await db.users.delete_one({"_id": user_id})
    clear_auth_cookies(response)
    return {"message": "account deleted"}
