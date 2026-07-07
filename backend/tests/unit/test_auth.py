import time

import pytest
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.middleware.auth_middleware import create_access_token, decode_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def test_create_and_decode_access_token_round_trip():
    user_id = "507f1f77bcf86cd799439011"
    token = create_access_token(user_id)
    payload = decode_token(token)

    assert payload["sub"] == user_id
    assert payload["type"] == "access"


def test_expired_token_raises_jwt_error():
    expired_payload = {
        "sub": "507f1f77bcf86cd799439011",
        "type": "access",
        "exp": int(time.time()) - 60,
    }
    expired_token = jwt.encode(
        expired_payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )

    with pytest.raises(JWTError):
        decode_token(expired_token)


def test_bcrypt_hash_and_verify_round_trip():
    password = "SuperSecret123"
    hashed = pwd_context.hash(password)

    assert hashed != password
    assert pwd_context.verify(password, hashed)
    assert not pwd_context.verify("WrongPassword", hashed)
