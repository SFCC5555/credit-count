-- profiles: one row per auth user, created automatically by the handle_new_user trigger.
-- id mirrors auth.users.id — cascades so deleting an auth user removes their profile and rides.
create table profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  display_name  text        not null,
  role          text        not null default 'enthusiast' check (role in ('enthusiast', 'admin')),
  private       boolean     not null default true,
  created_at    timestamptz not null default now()
);

-- coasters: the catalogue, seeded initially, managed by admins.
-- on delete restrict on rides keeps us from silently wiping ride history if a coaster is removed.
create table coasters (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  park          text        not null,
  country       text        not null,
  manufacturer  text        not null,
  type          text        not null,
  created_at    timestamptz not null default now()
);

-- rides: each row is one visit to one coaster by one user.
-- user_id cascades (rides die with the profile); coaster_id restricts (can't delete a coaster that has rides).
create table rides (
  id          uuid  primary key default gen_random_uuid(),
  user_id     uuid  not null references profiles(id)  on delete cascade,
  coaster_id  uuid  not null references coasters(id)  on delete restrict,
  ride_date   date  not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- covering indexes for the two most common query patterns
create index on rides (user_id);
create index on rides (coaster_id);
