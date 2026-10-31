from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import settings
from app.db import close_db, connect_db
from app.logger import get_logger
from app.routers import auth, health, mood

logger = get_logger("main")

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    if settings.sentry_dsn:
        sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.environment)
        logger.info("Sentry initialized")
    logger.info("MoodMap backend started")
    yield
    await close_db()
    logger.info("MoodMap backend stopped")


app = FastAPI(title="MoodMap API", version="1.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
_allowed_origins = list(dict.fromkeys([settings.frontend_url, *_default_origins]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(PyMongoError)
async def database_exception_handler(request: Request, exc: PyMongoError):
    logger.error(f"Database error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": (
                "Database is unavailable. If you use MongoDB Atlas, add your current "
                "public IP address to the project's Network Access IP allowlist."
            )
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "Validation error",
            "errors": [
                {"field": ".".join(str(p) for p in e["loc"]), "message": e["msg"]}
                for e in exc.errors()
            ],
        },
    )


app.include_router(auth.router, prefix="/api/v1")
app.include_router(mood.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")
