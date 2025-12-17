## Elokuvasovellus

Projektin toimeksiantona on toteuttaa leffaharrastajille websivusto. Sovellus hyödyntää avoimen datan rajapintaa (The movide database). Sovelluksen selaimessa toimiva osuus toteutetaan React- ja palvelin Node-tekniikalla. Tietokantana käytetään PostgreSQL-tietokantaa.


## Testing
### Local testing with npm:
1. Create test database:
```bash
createdb -U postgres netdb_test
```
2. Install dependencies:
```bash
cd api
npm install
```
3. Run tests:
```bash
npm test
```
### Testing with Docker:
1. Start Docker Desktop
2. Run the tests:
```bash
docker-compose -f docker-compose.test.yml up --build
```
3. Clean up containers and volumes:
```bash
docker-compose -f docker-compose.test.yml down -v
```

## Deploying to Render (production)

This project includes a `render.yaml` manifest to deploy the API, frontend and a managed Postgres on Render. The repository root file `render.yaml` configures:

- `movie-site-api` — Docker web service (uses `api/Dockerfile`).
- `movie-site-frontend` — Render static site (builds `frontend` and publishes `frontend/build`).
- `movie-site-db` — managed PostgreSQL database.

Required Render secrets / environment variables (set these in the Render dashboard or via the manifest):

- `JWT_SECRET` (secure) — used by the API for signing tokens.
- `TMDB_API_KEY` (secure) — your TMDB API key.
- `REACT_APP_API_URL` — the frontend build-time API base URL (e.g. `https://movie-site-api.onrender.com`).

Notes
- The API reads `DATABASE_URL` from the environment in production (no code changes required). The manifest ties the managed DB to the API service.
- The frontend uses `process.env.REACT_APP_API_URL` at build time, so ensure that `REACT_APP_API_URL` is set in the Render static site environment before build.

Importing initial SQL data
1. After Render creates the managed database, open the database details in the Render dashboard and copy the connection URL (it looks like `postgres://user:pass@host:port/dbname`).
2. From your local machine (where `psql` is available) run:

```bash
psql "<RENDER_DATABASE_URL>" -f movies.sql
```

Replace `<RENDER_DATABASE_URL>` with the connection string from Render (keep the quotes). This command imports `movies.sql` from the repository root into the created database.

Free plan caveats
- Render's free tier availability varies by account/region. If a `free` plan option is not available for web services or managed databases in your account, the Render UI will prompt you to choose a paid plan — choose the smallest plan you accept, or host Postgres elsewhere (e.g., Supabase, Railway) and provide its `DATABASE_URL`.

Troubleshooting & deploy tips
- If CORS blocks requests, ensure `FRONTEND_URL`/`REACT_APP_API_URL` match the deployed frontend domain and that `api/src/index.js` is using `process.env.FRONTEND_URL` (it already reads `process.env.FRONTEND_URL || http://localhost:3000`).
- To trigger a rebuild after changing environment variables in Render, redeploy the service from the Render dashboard.

If you want, I can also add an automated seed script that runs on first deploy and imports `movies.sql` automatically. (I can implement that next.)