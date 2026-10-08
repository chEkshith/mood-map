# MoodMap

A location-aware emotional wellness platform: describe how you feel, and MoodMap finds nearby places suited to help you reset, shift, or match your mood.

## Tech Stack

- **Backend:** FastAPI (Python 3.11), Motor (async MongoDB driver), Groq API (llama3-8b-8192) for mood classification, Google Places API (New), Cloudinary for image hosting, JWT auth via HttpOnly cookies, slowapi for rate limiting, Sentry for error tracking.
- **Frontend:** React 18 + TypeScript + Vite, Tailwind CSS, Zustand for state, react-leaflet + OpenStreetMap for maps, Recharts for dashboard charts, Axios for HTTP.
- **Infra:** Docker + docker-compose, GitHub Actions CI/CD, Render (backend) + Vercel (frontend) deployment targets.

## Architecture

A user signs up or logs in, receiving a JWT pair stored in HttpOnly cookies. When they describe how they feel, the backend sends the text to Groq's llama3-8b-8192 model to classify it into one of six moods (stressed, anxious, bored, exhausted, happy, melancholic), each mapped to a "reset / shift / match" strategy and a set of Google Place types. The backend then queries the Google Places API (New) Nearby Search for those types around the user's coordinates, ranks results by Haversine distance, logs the interaction to MongoDB for history and stats, and returns the results to the React frontend, which renders them on an interactive map and as cards.

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional, for containerized development)
- A MongoDB Atlas cluster (no local MongoDB container is used)

## Local Development

### With Docker

```bash
docker-compose up --build
```

Backend will be available at `http://localhost:8000`, frontend at `http://localhost:5173`.

### Manual

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key for Groq (mood classification) |
| `GOOGLE_PLACES_API_KEY` | API key for Google Places API (New) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Database name (default `moodmap`) |
| `JWT_SECRET_KEY` | Secret used to sign JWTs — generate with `openssl rand -hex 32` |
| `JWT_ALGORITHM` | JWT signing algorithm (default `HS256`) |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime in minutes |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime in days |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SENTRY_DSN` | Optional Sentry DSN for error tracking |
| `ENVIRONMENT` | `local` or `production` |
| `FRONTEND_URL` | URL of the frontend, used for CORS |
| `VITE_API_URL` (frontend) | Backend API base URL in production builds |

## API Keys Required

- **Groq** — https://console.groq.com
- **Google Places API (New)** — enable via Google Cloud Console
- **MongoDB Atlas** — https://www.mongodb.com/atlas
- **Cloudinary** — https://cloudinary.com

## Deployment

- **Backend:** deployed to [Render](https://render.com) as a web service; the CI pipeline triggers a deploy hook on every push to `main` after tests pass.
- **Frontend:** deployed to [Vercel](https://vercel.com), which auto-deploys on push to `main`; no manual deploy step is required in CI.

## CI/CD Pipeline

- **backend-ci.yml** — lints (`ruff check`), checks formatting (`ruff format --check`), and runs the pytest suite on every push/PR touching `backend/**`; deploys to Render on `main` after tests pass.
- **frontend-ci.yml** — installs dependencies, lints, type-checks (`tsc --noEmit`), and builds on every push/PR touching `frontend/**`. Vercel handles deployment automatically.
- **security-scan.yml** — runs `safety check` against backend dependencies and `npm audit --audit-level=high` against frontend dependencies, on push to `main` and weekly on a Monday cron schedule.
