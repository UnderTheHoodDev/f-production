# E2E tests (Playwright)

End-to-end tests for the Quote (Báo giá) feature: admin builder → publish → public
view → price feedback → PDF/Excel download → auth guard.

## Prerequisites

A reachable Postgres database. The production Supabase pooler is often paused/unreachable
from local dev, so the tests default to a local container:

```bash
# 1. Start a local Postgres for tests (known credentials, port 5440)
docker run -d --name fproduction-test-db \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fproduction \
  -p 5440:5432 postgres:16-alpine

# 2. Apply the schema
DATABASE_URL="postgresql://postgres:postgres@localhost:5440/fproduction" \
  npx prisma migrate deploy

# 3. Install the browser (once)
npx playwright install chromium
```

## Run

```bash
yarn build        # tests run against `next start` (production)
yarn test:e2e
```

`playwright.config.ts` starts `next start -p 3101` with the test `DATABASE_URL` and
logs in once (`auth.setup.ts`) to produce `e2e/.auth/admin.json`.

### Configuration

- `E2E_DATABASE_URL` — override the DB (e.g. point at a live Supabase instance).
- `E2E_PORT` — server port (default 3101).
- `E2E_ADMIN_USER` / `E2E_ADMIN_PASS` — admin credentials (default the repo `.env`).

## Cleanup

```bash
docker rm -f fproduction-test-db
```
