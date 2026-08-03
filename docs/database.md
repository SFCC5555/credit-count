# Database Reference — Credit Count

## Tables

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Mirrors `auth.users.id` — cascade-deleted when the auth user is removed |
| `display_name` | `text NOT NULL` | Set at sign-up via the `handle_new_user` trigger |
| `role` | `text NOT NULL` | `'enthusiast'` (default) or `'admin'` — check constraint enforced |
| `private` | `boolean NOT NULL` | `true` by default — user is hidden from the leaderboard |
| `created_at` | `timestamptz NOT NULL` | |

### `coasters`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `name` | `text NOT NULL` | |
| `park` | `text NOT NULL` | |
| `country` | `text NOT NULL` | Free text — no normalised lookup table in MVP |
| `manufacturer` | `text NOT NULL` | Free text |
| `type` | `text NOT NULL` | Free text (e.g. "Steel", "Wooden") |
| `created_at` | `timestamptz NOT NULL` | |

### `rides`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `user_id` | `uuid NOT NULL` | FK → `profiles.id` `ON DELETE CASCADE` |
| `coaster_id` | `uuid NOT NULL` | FK → `coasters.id` `ON DELETE RESTRICT` — prevents deleting a coaster that has ride history |
| `ride_date` | `date NOT NULL` | Date only (no time) — uses local date to avoid UTC-offset issues |
| `note` | `text` | Nullable |
| `created_at` | `timestamptz NOT NULL` | Used as tiebreaker when two rides share the same `ride_date` |

**Indexes:**
```sql
create index on rides (user_id);
create index on rides (coaster_id);
```

---

## Row Level Security

RLS is enabled on every table. Table-level `GRANT` statements are explicit in each migration because "Automatically expose new tables" is disabled on this project — RLS alone is not enough, Postgres also requires a table-level privilege before it evaluates policies.

### `profiles`

| Grant | Role |
|---|---|
| `SELECT` | `authenticated` |
| `UPDATE (display_name, private)` | `authenticated` (column-scoped — prevents self-promotion to `admin` via direct API) |

| Policy | Operation | Rule |
|---|---|---|
| `profiles: owner select` | SELECT | `auth.uid() = id` |
| `profiles: owner update` | UPDATE | `auth.uid() = id` |

No INSERT policy — profile creation is owned by the `handle_new_user` trigger (SECURITY DEFINER).
No DELETE policy — removed via `ON DELETE CASCADE` from `auth.users`.

### `coasters`

| Grant | Role |
|---|---|
| `SELECT, INSERT, UPDATE, DELETE` | `authenticated` |

| Policy | Operation | Rule |
|---|---|---|
| `coasters: authenticated read` | SELECT | `auth.role() = 'authenticated'` |
| `coasters: admin insert` | INSERT | caller's `profiles.role = 'admin'` |
| `coasters: admin update` | UPDATE | caller's `profiles.role = 'admin'` |
| `coasters: admin delete` | DELETE | caller's `profiles.role = 'admin'` |

Visitors (unauthenticated) have no access to the catalogue — enforced at DB level.

### `rides`

| Grant | Role |
|---|---|
| `SELECT, INSERT, UPDATE, DELETE` | `authenticated` |

| Policy | Operation | Rule |
|---|---|---|
| `rides: owner select` | SELECT | `auth.uid() = user_id` |
| `rides: owner insert` | INSERT | `auth.uid() = user_id` |
| `rides: owner update` | UPDATE | `auth.uid() = user_id` |
| `rides: owner delete` | DELETE | `auth.uid() = user_id` |

Strict per-user isolation — no user (including Admin) can read or modify another user's rides.

---

## Triggers

### `handle_new_user`
Fires `AFTER INSERT ON auth.users`. Creates the matching `profiles` row automatically, pulling `display_name` from the sign-up metadata. `COALESCE` guards against a missing key to prevent a NOT NULL violation.

```sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
```

---

## SQL Functions

### `public_leaderboard()`

```sql
returns table(display_name text, credits bigint)
language sql
security definer
stable
```

`SECURITY DEFINER` — runs with the function owner's privileges, bypassing RLS on `profiles` and `rides`. The query exposes **only** `display_name` and `count(distinct coaster_id)` for users with `private = false`. Which coasters a user has ridden is never exposed.

Granted to `anon` so unauthenticated visitors can call it from the public leaderboard page.

---

## Migrations

| File | Description |
|---|---|
| `20260802203001_create_core_tables.sql` | `profiles`, `coasters`, `rides` tables + indexes |
| `20260802203435_create_user_trigger.sql` | `handle_new_user` function + trigger |
| `20260802210744_enable_rls_policies.sql` | RLS enable, table grants, all policies |
| `20260802220000_create_leaderboard_function.sql` | `public_leaderboard()` function |
