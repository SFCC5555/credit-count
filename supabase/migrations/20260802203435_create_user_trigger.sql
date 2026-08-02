-- Fires after every confirmed sign-up and inserts a matching profiles row.
-- display_name is pulled from the metadata the client sends at sign-up time;
-- coalesce guards against a missing key so the row is never rejected with a not-null violation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Unnamed Enthusiast')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
