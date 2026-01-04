create or replace function public.handle_new_auth_user_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.orgs (id, name, slug)
  values (
    'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a',
    'ICONIC Academy',
    'iconic-academy'
  )
  on conflict (id) do nothing;

  insert into public.accounts (
    org_id,
    auth_user_id,
    email,
    status,
    email_verified,
    email_verified_at
  )
  values (
    'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a',
    new.id,
    new.email,
    'active',
    new.email_confirmed_at is not null,
    new.email_confirmed_at
  )
  on conflict (org_id, auth_user_id) do update
    set email = excluded.email,
        email_verified = excluded.email_verified,
        email_verified_at = excluded.email_verified_at,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user_verified();

update public.accounts
set email_verified = true,
    email_verified_at = coalesce(email_verified_at, now()),
    updated_at = now()
where org_id = 'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a'
  and email is not null;
