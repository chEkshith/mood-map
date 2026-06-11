# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import mood

app = FastAPI(
    title="MoodMap API",
    version="0.1.0",
    description="Mood-aware place suggestion engine",
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(mood.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
