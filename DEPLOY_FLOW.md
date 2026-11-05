# MoodMap Deployment Flow (Vercel + Render)

This guide deploys the MoodMap monorepo:

- Repository: https://github.com/chEkshith/mood-map
- Frontend: React + Vite → Vercel
- Backend: FastAPI → Render
- Database: MongoDB Atlas
- Auth: cross-site HttpOnly cookies between Vercel and Render

The repo already includes:

- `frontend/vercel.json` — Vite build settings and SPA rewrites for React Router
- `frontend/.env.example` — frontend environment template
- `render.yaml` — Render Blueprint for the backend
- `backend/.python-version` — pins Python 3.11.9 on Render
- `backend/Procfile` — fallback start command for manual Render setup

---

## 0. Before you start

You need accounts/keys for:

1. [GitHub](https://github.com/chEkshith/mood-map)
2. [Vercel](https://vercel.com)
3. [Render](https://render.com)
4. [MongoDB Atlas](https://www.mongodb.com/atlas)
5. [Groq Console](https://console.groq.com)
6. [Google Cloud Console](https://console.cloud.google.com) with **Places API (New)** enabled and billing on
7. [Cloudinary](https://cloudinary.com)
8. Optional: [Sentry](https://sentry.io)

Make sure the latest code is pushed to `main`:

```bash
git add .
git commit -m "chore: prepare for Vercel and Render deployment"
git push origin main
```

---

## 1. Create the MongoDB Atlas database

1. Create a free Atlas cluster.
2. Create a database user with read/write access.
3. Open **Security → Network Access → Add IP Address**.
4. For Render, add `0.0.0.0/0` (Render egress IPs are not static on the free plan).
   - This is required for the backend to connect.
   - For stricter production setups, use a dedicated Render static egress IP or a private endpoint instead.
5. Copy the connection string:

```text
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

6. Replace `<user>`, `<password>`, and `<cluster>`. Keep the database name separate in `MONGODB_DB_NAME`.

> The backend creates its collections and indexes automatically on startup.

---

## 2. Deploy the backend on Render

You can use the included Blueprint (recommended) or create a web service manually.

### Option A — Render Blueprint (recommended)

1. Open the [Render Dashboard](https://dashboard.render.com).
2. Click **New + → Blueprint**.
3. Connect GitHub and select:

   ```text
   https://github.com/chEkshith/mood-map
   ```

4. Select the `main` branch.
5. Render detects `render.yaml` and shows the `moodmap-api` service.
6. Fill in the environment variables marked as required (`sync: false`):

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |
| `GOOGLE_PLACES_API_KEY` | Your Google Places API (New) key |
| `MONGODB_URI` | Atlas connection string from step 1 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FRONTEND_URL` | Temporary value: `http://localhost:5173` (update after Vercel deploy) |
| `SENTRY_DSN` | Optional; leave blank if unused |

The Blueprint already sets:

- `PYTHON_VERSION=3.11.9`
- `ENVIRONMENT=production`
- `MONGODB_DB_NAME=moodmap`
- `JWT_ALGORITHM=HS256`
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15`
- `JWT_REFRESH_TOKEN_EXPIRE_DAYS=7`
- A generated `JWT_SECRET_KEY`

7. Click **Apply**.
8. Wait for the deploy to finish. The service health check is:

   ```text
   https://<your-render-service>.onrender.com/api/v1/health
   ```

   It should return:

   ```json
   {"status":"ok","uptime_seconds":0}
   ```

9. Copy the Render service URL, for example:

   ```text
   https://moodmap-api.onrender.com
   ```

> Render provides `PORT` automatically. Do not set it manually.

> The free plan may spin down after inactivity. The first request after a spin-down can take 30–60 seconds.

### Option B — Manual Render web service

1. Render Dashboard → **New + → Web Service**.
2. Connect `https://github.com/chEkshith/mood-map`.
3. Configure:

| Setting | Value |
|---|---|
| Name | `moodmap-api` |
| Region | Closest to your users |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install --upgrade pip && pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/api/v1/health` |
| Instance Type | Free or Starter |

4. Add the environment variables from the table in Option A.
5. Add:

   ```text
   ENVIRONMENT=production
   MONGODB_DB_NAME=moodmap
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
   JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
   ```

6. Generate a JWT secret:

   ```bash
   openssl rand -hex 32
   ```

   Set it as `JWT_SECRET_KEY`.

7. Deploy and verify `https://<your-render-service>.onrender.com/api/v1/health`.

---

## 3. Deploy the frontend on Vercel

1. Open the [Vercel Dashboard](https://vercel.com/new).
2. Import the repository:

   ```text
   https://github.com/chEkshith/mood-map
   ```

3. Configure the project:

| Setting | Value |
|---|---|
| Project Name | `mood-map` (or any name) |
| Framework Preset | `Vite` |
| Root Directory | `frontend` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 20.x or newer |

4. Add the environment variable:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<your-render-service>.onrender.com` |

Do **not** append `/api/v1`; the frontend adds it automatically.

5. If you use Vercel preview deployments, add `VITE_API_URL` under **Preview** too, and add the preview origin to Render's `FRONTEND_URL` later.
6. Click **Deploy**.
7. Vercel builds the app and deploys it. Copy the production URL, for example:

   ```text
   https://mood-map.vercel.app
   ```

> `frontend/vercel.json` adds the SPA rewrite so routes like `/app`, `/dashboard`, `/history`, `/profile`, and `/about` work on refresh and direct navigation.

> `VITE_API_URL` is embedded at build time. If you change it later, redeploy the Vercel project.

---

## 4. Connect Vercel back to the Render backend

The backend must allow the Vercel frontend origin and set cross-site cookies.

1. Go to Render → `moodmap-api` → **Environment**.
2. Update:

   ```text
   FRONTEND_URL=https://mood-map.vercel.app
   ```

   - Use the exact Vercel production URL.
   - Do not include a trailing slash.
   - `FRONTEND_URL` supports comma-separated values, for example:

     ```text
     https://mood-map.vercel.app,https://mood-map-git-main-yourteam.vercel.app
     ```

3. Confirm:

   ```text
   ENVIRONMENT=production
   ```

   This is required. It enables `Secure` + `SameSite=None` cookies so the Vercel frontend can authenticate against the Render backend.

4. Save the environment changes. Render redeploys/restarts the service automatically.

---

## 5. Verify the deployment

Open the Vercel URL and test:

1. Sign up with a new account.
2. Refresh the page; the session should persist.
3. Submit a mood and click **Find places nearby**.
4. Check that places appear on the map and in the result cards.
5. Open a place detail panel and click **Open in Google Maps**.
6. Visit **Dashboard** and **History**.
7. Upload and remove a profile picture in **Profile**.
8. Log out and log back in.

In browser DevTools → **Application → Cookies → your Render domain**, you should see:

- `access_token`
- `refresh_token`

Both should be `Secure` and `SameSite=None` in production.

If cookies are missing, see the troubleshooting section below.

---

## 6. CI/CD (optional but recommended)

### Vercel

Vercel automatically deploys every push to `main` when the repository is connected. No extra configuration is required.

### Render

`render.yaml` sets:

```yaml
autoDeploy: false
```

This lets the existing GitHub Actions workflow deploy the backend only after tests pass.

1. In Render, open `moodmap-api` → **Settings → Deploy Hook**.
2. Copy the deploy hook URL.
3. In GitHub, open the repository → **Settings → Secrets and variables → Actions**.
4. Add a repository secret:

   ```text
   RENDER_DEPLOY_HOOK=<the Render deploy hook URL>
   ```

5. The workflow `.github/workflows/backend-ci.yml` triggers the deploy after backend tests pass on `main`.

The Ruff lint and formatting steps are currently advisory (`continue-on-error: true`) because of pre-existing backend style issues. Tests and deploys are not blocked by them. Remove those two settings once the backend is lint-clean.

If you prefer Render's native auto-deploy, change `autoDeploy` to `true` in `render.yaml` and do not set the `RENDER_DEPLOY_HOOK` secret.

### CI test secrets

The backend test workflow also reads these GitHub Actions secrets:

- `GROQ_API_KEY`
- `GOOGLE_PLACES_API_KEY`
- `MONGODB_URI`
- `JWT_SECRET_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Add them to make the backend CI workflow pass.

---

## 7. Optional custom domains

### Vercel

1. Vercel project → **Settings → Domains**.
2. Add your domain and follow the DNS instructions.
3. Update Render's `FRONTEND_URL` to the custom domain.

### Render

1. Render service → **Settings → Custom Domains**.
2. Add your domain and follow the DNS instructions.
3. Update Vercel's `VITE_API_URL` to the custom backend domain.
4. Redeploy the Vercel project.

---

## 8. Troubleshooting

### `401 Unauthorized` after login, or cookies are not stored

- Confirm Render has `ENVIRONMENT=production`.
- Confirm the frontend is served over HTTPS.
- Confirm `FRONTEND_URL` exactly matches the Vercel origin (scheme + host, no trailing slash).
- Confirm the browser is not blocking third-party cookies.
- In DevTools → Network, check the `Set-Cookie` response headers from Render.

### CORS error in the browser

- `FRONTEND_URL` must include the exact origin shown in the error.
- If using Vercel preview deployments, add each preview URL to `FRONTEND_URL` as a comma-separated value.
- Redeploy/restart the Render service after changing `FRONTEND_URL`.

### Backend returns 503 `Database is unavailable`

- MongoDB Atlas is blocking Render's IP.
- Add `0.0.0.0/0` to Atlas Network Access, or use a fixed Render egress IP.
- Confirm `MONGODB_URI` uses the correct username, password, and cluster hostname.

### Render build fails on `certifi` or Python version

- The repo pins Python `3.11.9` via `backend/.python-version`.
- Confirm the Render service root directory is `backend`.
- Confirm `certifi` is installed from `backend/requirements.txt`.

### Vercel returns 404 when refreshing `/app` or `/history`

- Confirm the Vercel root directory is `frontend`.
- Confirm `frontend/vercel.json` is present and the SPA rewrite is active.
- Redeploy after adding/changing `vercel.json`.

### `VITE_API_URL` change does not take effect

- Vite embeds environment variables at build time.
- Redeploy the Vercel project after changing `VITE_API_URL`.

### First request is slow

- Render free instances spin down after inactivity.
- Upgrade to a paid instance or keep the service warm if cold starts are a problem.

### Place photos are missing

- The Google Places API may not return photo metadata for some places/API keys.
- The frontend automatically shows a category-based visual placeholder when no photo is available.

---

## Quick reference

| Component | Platform | Root Directory | Build Command | Start Command |
|---|---|---|---|---|
| Frontend | Vercel | `frontend` | `npm run build` | Vercel static hosting |
| Backend | Render | `backend` | `pip install --upgrade pip && pip install -r requirements.txt` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

| Variable | Platform | Example |
|---|---|---|
| `VITE_API_URL` | Vercel | `https://moodmap-api.onrender.com` |
| `FRONTEND_URL` | Render | `https://mood-map.vercel.app` |
| `ENVIRONMENT` | Render | `production` |
| `MONGODB_URI` | Render | `mongodb+srv://...` |
| `MONGODB_DB_NAME` | Render | `moodmap` |
