create or replace function public.handle_new_auth_user_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_rows integer;
begin
  insert into public.orgs (id, name, slug)
  values (
    'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a',
    'ICONIC Academy',
    'iconic-academy'
  )
  on conflict (id) do nothing;

  update public.accounts
  set auth_user_id = new.id,
      email = new.email,
      status = 'active',
      email_verified = new.email_confirmed_at is not null,
      email_verified_at = new.email_confirmed_at,
      updated_at = now()
  where org_id = 'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a'
    and (email ilike new.email or auth_user_id = new.id);

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  if updated_rows = 0 then
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
  end if;

  return new;
end;
$$;
