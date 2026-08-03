-- Public leaderboard function.
-- SECURITY DEFINER runs with the owner's privileges, bypassing RLS on the
-- underlying tables. The query intentionally exposes only display_name and
-- credit count — never which coasters a user has ridden.
create or replace function public_leaderboard()
returns table(display_name text, credits bigint)
language sql
security definer
set search_path = public
stable
as $$
  select
    p.display_name,
    count(distinct r.coaster_id) as credits
  from profiles p
  left join rides r on r.user_id = p.id
  where p.private = false
  group by p.id, p.display_name
  order by credits desc, p.display_name asc;
$$;

-- Allow unauthenticated visitors to call this function.
grant execute on function public_leaderboard() to anon;
