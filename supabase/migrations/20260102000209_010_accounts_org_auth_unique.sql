do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'accounts_org_id_auth_user_id_key'
  ) then
    alter table public.accounts
      add constraint accounts_org_id_auth_user_id_key
      unique (org_id, auth_user_id);
  end if;
end $$;
