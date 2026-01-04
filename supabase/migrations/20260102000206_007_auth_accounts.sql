create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.accounts (org_id, auth_user_id, email, status)
  values (
    'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a',
    new.id,
    new.email,
    'active'
  )
  on conflict (org_id, auth_user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

insert into public.accounts (org_id, auth_user_id, email, status)
select
  'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a',
  u.id,
  u.email,
  'active'
from auth.users u
left join public.accounts a
  on a.auth_user_id = u.id
  and a.org_id = 'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a'
where a.id is null;
