# Personal Finance App

A full-stack personal finance tracker built with Next.js, Fastify, GraphQL, and PostgreSQL. Covers budgets, savings pots, transactions, and recurring bills — all in one place.

**Live demo**: [your-app.vercel.app](https://your-app.vercel.app) <!-- replace with your Vercel URL -->

---

## Features

- **Overview Dashboard** — Balance, income, and expenses at a glance with summary widgets
- **Transactions** — Full transaction history with search, category filter, sorting, and pagination
- **Budgets** — Create and manage spending budgets with a visual donut chart and monthly spend tracking
- **Pots** — Savings goals with add/withdraw functionality and progress bars
- **Recurring Bills** — Monthly bill tracking with paid/upcoming/due-soon status

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, PrimeReact |
| API | Fastify, Mercurius (GraphQL), schema-first |
| Database | PostgreSQL 16, Sequelize ORM |
| Infra | Docker, Docker Compose |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
│              Next.js + React + PrimeReact                │
│                  Apollo Client (GraphQL)                  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/GraphQL
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Fastify Backend                         │
│              Mercurius GraphQL Plugin                     │
│         Schema-first | Typed Resolvers                    │
│              Sequelize ORM (TypeScript)                   │
└──────────────────────────┬──────────────────────────────┘
                           │ SQL
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL 16                           │
│   transactions | budgets | pots | recurring_bills         │
└─────────────────────────────────────────────────────────┘

Docker Compose orchestrates all three services locally
```

---

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for step-by-step setup.

---

## Project Structure

```
personal-finance-app/
├── frontend/
│   └── src/
│       ├── pages/          # Next.js pages (index, transactions, budgets, pots, recurring-bills)
│       ├── components/     # React components organized by feature
│       │   ├── layout/     # Sidebar, Layout, MobileNav
│       │   ├── overview/   # Dashboard widgets
│       │   ├── transactions/
│       │   ├── budgets/
│       │   ├── pots/
│       │   ├── bills/
│       │   └── shared/     # Avatar, DeleteConfirmModal, ThemeColorPicker
│       ├── graphql/        # Apollo queries, mutations, fragments
│       ├── lib/            # apolloClient, formatters
│       ├── styles/         # globals.css with CSS custom properties
│       └── types/          # TypeScript interfaces + constants (THEME_COLORS, CATEGORIES)
├── backend/
│   └── src/
│       ├── models/         # Sequelize-typescript models
│       ├── migrations/     # Database migrations (up/down)
│       ├── seeders/        # Seed data
│       ├── graphql/
│       │   ├── schema.ts   # GraphQL SDL type definitions
│       │   └── resolvers/  # Resolver functions by feature
│       ├── plugins/        # Fastify plugins (cors, graphql/mercurius)
│       ├── config.ts       # Central config from env vars
│       ├── server.ts       # Fastify server builder
│       └── index.ts        # Entry point
├── docker-compose.yml
└── docker-compose.prod.yml
```

---

## Environment Variables

Copy `.env.example` to `.env`. Defaults work for local development without any changes.

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `finance_db` | Database name |
| `DB_USER` | `finance_user` | Database user |
| `DB_PASSWORD` | `finance_pass` | Database password |
| `BACKEND_PORT` | `4000` | Backend API port |
| `FRONTEND_PORT` | `3000` | Frontend port |
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:4000/graphql` | GraphQL endpoint (browser-side) |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | `development` | Node environment |

---

## Development

### Docker (recommended)

```bash
cp .env.example .env
docker-compose up -d postgres
docker-compose --profile migrate run --rm backend-migrate
docker-compose --profile seed run --rm backend-seed
docker-compose up backend frontend
```

### Local (Node.js 20+ and PostgreSQL 16 required)

```bash
# Backend
cd backend && npm install
npm run db:migrate
npm run db:seed
npm run dev       # http://localhost:4000

# Frontend (new terminal)
cd frontend && npm install
npm run dev       # http://localhost:3000
```

### Production

```bash
cp .env.example .env
# Edit .env with production values
docker-compose -f docker-compose.prod.yml up -d
```

---

## Database Schema

| Table | Key Columns |
|-------|------------|
| `transactions` | id, name, avatar_url, category, date, amount (DECIMAL), recurring (BOOL) |
| `budgets` | id, category (UNIQUE), maximum (DECIMAL), theme |
| `pots` | id, name (UNIQUE), target (DECIMAL), total (DECIMAL), theme |
| `recurring_bills` | id, name, avatar_url, category, amount (DECIMAL), due_day (INT) |

---

## GraphQL API

**Endpoint**: `http://localhost:4000/graphql`
**Playground**: `http://localhost:4000/graphiql` (dev only)

### Queries

```graphql
query Overview {
  overview {
    balance { current income expenses }
    pots { id name total target theme percentage }
    transactions { id name category date amount recurring }
    budgets { id category maximum theme spent remaining }
    billsSummary { totalPaid totalUpcoming dueSoon }
  }
}

query Transactions($page: Int, $limit: Int, $search: String, $category: String, $sortBy: String) {
  transactions(page: $page, limit: $limit, search: $search, category: $category, sortBy: $sortBy) {
    transactions { id name category date amount }
    total page totalPages
  }
}

# Also: budgets, pots, recurringBills(search, sortBy)
```

### Mutations

```graphql
mutation CreateBudget($input: BudgetInput!) {
  createBudget(input: $input) { id category maximum theme }
}

mutation AddMoneyToPot($id: ID!, $amount: Float!) {
  addMoneyToPot(id: $id, amount: $amount) { id name total percentage }
}

# Also: updateBudget, deleteBudget
#       createPot, updatePot, deletePot, withdrawFromPot
#       createRecurringBill, updateRecurringBill, deleteRecurringBill
#       createTransaction, deleteTransaction
```

---

## Conventions

### Backend

1. **Config**: All config comes from environment variables via `src/config.ts`. Nothing hardcoded.
2. **Models**: `sequelize-typescript` decorators. New models go in `src/models/index.ts`.
3. **Migrations**: TypeScript files with `up()` / `down()` in `src/migrations/`. Run with `npm run db:migrate`.
4. **GraphQL**: Schema-first in `src/graphql/schema.ts`. Resolvers split by feature.
5. **Decimal handling**: PostgreSQL DECIMAL comes back as strings from Sequelize — always `parseFloat()` before returning.
6. **Fastify plugins**: Wrap with `fastify-plugin` (`fp`) to avoid encapsulation issues.

### Frontend

1. **Apollo Client**: `src/lib/apolloClient.ts`, `errorPolicy: 'all'`.
2. **GraphQL files**: Queries in `queries/index.ts`, mutations in `mutations/index.ts`, fragments in `fragments/index.ts`.
3. **State**: Page-level only — no global store. Apollo cache handles server state.
4. **Forms**: Wrapped in `<form>` with `name` on every field. Validate before calling mutations.
5. **Styling**: CSS custom properties in `globals.css`. PrimeReact + scoped class overrides. No CSS modules.
6. **Types**: All interfaces in `src/types/index.ts`.
7. **Currency**: `formatCurrency` / `formatCurrencyAbs` in `src/lib/formatters.ts` — `de-DE` locale, EUR. Normalizes the narrow no-break space (U+202F) that `Intl` inserts before `€`.

---

## Implementation Notes

- **isPaid / isDueSoon**: Computed at query time. `isPaid` = `currentDay > dueDay`. `isDueSoon` = within 5 days.
- **Budget spent**: Summed from negative transactions in the current month for that category — not stored.
- **Balance**: Derived from all transactions (positive = income, negative = expense). No separate balance table.
- **Pot percentage**: `Math.min(100, (total / target) * 100)` — capped at 100%.
- **Donut chart**: Custom SVG, no chart library. Segments computed from budget maximums.
- **Theme colors**: `THEME_COLORS` in `frontend/src/types/index.ts`. Already-used colors are disabled in the picker.

---

## Adding New Features

1. Write a migration in `backend/src/migrations/`
2. Update the Sequelize model and register it in `src/models/index.ts`
3. Update the GraphQL schema in `backend/src/graphql/schema.ts`
4. Add a resolver in `backend/src/graphql/resolvers/`
5. Add the Apollo query/mutation in `frontend/src/graphql/`
6. Update types in `frontend/src/types/index.ts`
7. Update the React components
