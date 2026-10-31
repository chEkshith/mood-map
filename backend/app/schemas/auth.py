from pydantic import BaseModel, EmailStr, Field, field_validator

BCRYPT_MAX_PASSWORD_BYTES = 72


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=BCRYPT_MAX_PASSWORD_BYTES)
    display_name: str = Field(min_length=2, max_length=50)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("display_name")
    @classmethod
    def strip_display_name(cls, value: str) -> str:
        return value.strip()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    display_name: str
    avatar_url: str | None = None
    created_at: str
    mood_streak: int = 0
    total_entries: int = 0


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=BCRYPT_MAX_PASSWORD_BYTES)


class UpdateProfileRequest(BaseModel):
    display_name: str = Field(min_length=2, max_length=50)

    @field_validator("display_name")
    @classmethod
    def strip_display_name(cls, value: str) -> str:
        return value.strip()
