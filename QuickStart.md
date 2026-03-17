# Quickstart

Get the Personal Finance App running locally in under 5 minutes.

**Prerequisites**: [Docker](https://www.docker.com/get-started) and Docker Compose installed. Nothing else required.

---

## Steps

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd personal-finance-app
cp .env.example .env
```

The defaults in `.env` work out of the box — no changes needed for local development.

### 2. Start the database

```bash
docker-compose up -d postgres
```

Wait ~5 seconds for PostgreSQL to be ready.

### 3. Run migrations and seed data

```bash
# Create tables
docker-compose --profile migrate run --rm backend-migrate

# Load sample data (transactions, budgets, pots, bills)
docker-compose --profile seed run --rm backend-seed
```

### 4. Start the app

```bash
docker-compose up backend frontend
```

Wait ~30 seconds for both services to compile and start.

### 5. Open in browser

| Service | URL |
|---------|-----|
| App (Frontend) | http://localhost:3000 |
| GraphQL API | http://localhost:4000/graphql |
| GraphQL Playground | http://localhost:4000/graphiql |

---

## All-in-one command

```bash
cp .env.example .env && \
docker-compose up -d postgres && \
sleep 8 && \
docker-compose --profile migrate run --rm backend-migrate && \
docker-compose --profile seed run --rm backend-seed && \
docker-compose up backend frontend
```

---

## Useful commands

```bash
# Backend (cd backend/)
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run db:reset     # Drop + re-migrate + seed

# Frontend (cd frontend/)
npm run dev          # Start Next.js dev server
npm run build        # Production build
```

---

## Resetting data

Wipe and re-seed the database:

```bash
docker-compose --profile migrate run --rm backend-migrate -- --reset
docker-compose --profile seed run --rm backend-seed
```

Full volume reset:

```bash
docker-compose down -v          # destroys postgres_data volume
docker-compose up -d postgres
sleep 8
docker-compose --profile migrate run --rm backend-migrate
docker-compose --profile seed run --rm backend-seed
docker-compose up backend frontend
```

---

## Troubleshooting

**Port already in use?**
```bash
# Change ports in .env
BACKEND_PORT=4001
FRONTEND_PORT=3001
```

**Database connection refused?**
```bash
docker-compose ps postgres
docker-compose logs postgres
```

**Migrations fail?**
```bash
docker-compose --profile migrate run --rm backend-migrate
```

**Frontend can't reach backend?**
Make sure `NEXT_PUBLIC_GRAPHQL_URL` in `.env` matches the backend port.

**Backend crashes with `ENOTFOUND postgres`?**
The backend retries the DB connection up to 10 times. If it still fails, check that the `postgres` service is on the same Docker network:
```bash
docker-compose ps
docker network ls
```
