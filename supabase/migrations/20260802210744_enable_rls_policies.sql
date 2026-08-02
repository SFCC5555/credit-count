-- ── Enable RLS on every table ────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.coasters enable row level security;
alter table public.rides    enable row level security;


-- ── Table-level grants ───────────────────────────────────────────────────────
-- Required because "Automatically expose new tables" is disabled on this project,
-- so no default grants were created. RLS alone is not enough — Postgres also
-- needs a table-level privilege before it evaluates policies.

-- profiles: SELECT only. INSERT is handled by the security-definer trigger;
-- DELETE cascades from auth.users. The column-scoped UPDATE grant
-- (display_name, private) is added below alongside the owner-update policy.
grant select on public.profiles to authenticated;

-- coasters and rides: full DML — RLS policies do the actual row-level filtering.
grant select, insert, update, delete on public.coasters to authenticated;
grant select, insert, update, delete on public.rides    to authenticated;


-- ── profiles ─────────────────────────────────────────────────────────────────

-- Users can only read their own profile row directly.
-- The public leaderboard is served by a security definer view that reads
-- across profiles internally — the base table is not publicly readable.
create policy "profiles: owner select"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can only update their own profile row.
create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Restrict which columns an authenticated user can update.
-- Without this, a user could PATCH role='admin' on their own row via direct API.
revoke update on public.profiles from authenticated;
grant update (display_name, private) on public.profiles to authenticated;

-- No direct inserts — the handle_new_user trigger owns profile creation.
-- No delete policy — profile rows are removed via cascade from auth.users.


-- ── coasters ─────────────────────────────────────────────────────────────────

-- Catalogue requires a session. Per the SOW, visitors can only see the
-- leaderboard and sign-up — the catalogue sits under the (app) route group.
create policy "coasters: authenticated read"
  on public.coasters for select
  using (auth.role() = 'authenticated');

-- Only admins can add coasters.
create policy "coasters: admin insert"
  on public.coasters for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can edit coasters.
create policy "coasters: admin update"
  on public.coasters for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can delete coasters.
create policy "coasters: admin delete"
  on public.coasters for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ── rides ────────────────────────────────────────────────────────────────────
-- Strict per-user isolation: no one — including admins — can see or touch
-- another user's ride rows. Enforced at the database level.

create policy "rides: owner select"
  on public.rides for select
  using (auth.uid() = user_id);

-- user_id is fixed to the authenticated user on insert so a user
-- cannot log a ride on behalf of someone else.
create policy "rides: owner insert"
  on public.rides for insert
  with check (auth.uid() = user_id);

create policy "rides: owner update"
  on public.rides for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "rides: owner delete"
  on public.rides for delete
  using (auth.uid() = user_id);
