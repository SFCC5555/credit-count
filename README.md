# Credit Count

A web app for rollercoaster enthusiasts to log the coasters they've ridden, track personal stats, and compete on a public leaderboard.

Built with Next.js 16 (App Router), Supabase, and Tailwind CSS v4. Deployed on Vercel.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / Auth | Supabase (PostgreSQL + Auth + RLS) |
| Deployment | Vercel |

---

## Local development

### Prerequisites

- Node.js 20+
- A Supabase project (free tier is fine)
- Supabase CLI: `npm install -g supabase`

### 1. Clone and install

```bash
git clone <repo-url>
cd credit-count
npm install
```

### 2. Environment variables

Create `.env.local` at the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `SUPABASE_SECRET_KEY` is intentionally **not** required — every feature works through authenticated sessions + RLS. Keep it in `.env.local` only if you need it for local scripts; never set it in Vercel.

### 3. Apply database migrations

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

This applies all migrations in `supabase/migrations/` in order.

### 4. Seed the catalogue

Supabase's CLI doesn't seed a remote project directly — `db push`
only applies migrations. Load the initial catalogue by opening the
**SQL Editor** in your Supabase dashboard, pasting the full contents
of `supabase/seed.sql`, and running it once.

> `seed.sql` uses plain INSERT statements with no ON CONFLICT guard —
> only run it against an empty catalogue. Running it twice will
> duplicate every coaster.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roles

| Role | How to assign |
|---|---|
| `enthusiast` | Default for all sign-ups |
| `admin` | Set `role = 'admin'` on the user's row in the `profiles` table via the Supabase dashboard |

There is no self-serve admin sign-up. Role assignment is manual and intentional.

---

## Project structure

```
app/
  (app)/            # Authenticated routes (dashboard, catalog, rides, admin)
  auth/confirm/     # Route Handler — exchanges PKCE code for session
  page.tsx          # Public leaderboard
components/
  ui/               # Design system (Button, Card, Modal, Table, Badge, Toast…)
lib/
  supabase/         # Browser + server Supabase clients
  types.ts
supabase/
  migrations/       # Versioned SQL migrations
  seed.sql          # Initial coaster catalogue
docs/
  TDD.md            # Full Technical Design Document
  database.md       # DB schema, RLS policies, triggers, functions
  api-security-tests.local.sh  # Curl-based security validation script
```

---

## Database

See [`docs/database.md`](docs/database.md) for the full schema, RLS policies, triggers, and SQL functions.
