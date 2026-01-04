create or replace function public.handle_auth_user_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    return new;
  end if;

  update public.accounts
  set email_verified = true,
      email_verified_at = coalesce(email_verified_at, now()),
      updated_at = now()
  where org_id = 'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a'
    and auth_user_id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_confirmed on auth.users;

create trigger on_auth_user_email_confirmed
  after update of email_confirmed_at on auth.users
  for each row execute procedure public.handle_auth_user_email_confirmed();
