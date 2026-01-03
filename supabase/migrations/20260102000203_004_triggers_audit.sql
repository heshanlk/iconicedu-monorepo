create or replace function public.set_created_by()
returns trigger
language plpgsql
as $$
begin
  if new.created_by is null then
    new.created_by = public.current_account_id();
  end if;
  return new;
end;
$$;

create or replace function public.set_updated_by()
returns trigger
language plpgsql
as $$
begin
  new.updated_by = public.current_account_id();
  new.updated_at = now();
  return new;
end;
$$;

-- Example application (repeat for all tables)
create trigger set_created_by_accounts
  before insert on public.accounts
  for each row execute procedure public.set_created_by();

create trigger set_updated_by_accounts
  before update on public.accounts
  for each row execute procedure public.set_updated_by();
