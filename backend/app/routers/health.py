import time

from fastapi import APIRouter, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import Depends

from app.db import get_db
from app.logger import get_logger

logger = get_logger("health")
router = APIRouter(tags=["health"])

_START_TIME = time.time()


@router.get("/health")
async def liveness():
    return {"status": "ok", "uptime_seconds": int(time.time() - _START_TIME)}


@router.get("/health/ready")
async def readiness(response: Response, db: AsyncIOMotorDatabase = Depends(get_db)):
    dependencies = {}
    all_ok = True

    try:
        await db.command("ping")
        dependencies["mongodb"] = "ok"
    except Exception as exc:  # noqa: BLE001
        logger.error(f"MongoDB readiness check failed: {exc}")
        dependencies["mongodb"] = "degraded"
        all_ok = False

    response.status_code = (
        status.HTTP_200_OK if all_ok else status.HTTP_503_SERVICE_UNAVAILABLE
    )
    return {"status": "ok" if all_ok else "degraded", "dependencies": dependencies}
