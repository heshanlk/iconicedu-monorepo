with ranked as (
  select
    id,
    row_number() over (
      partition by org_id, account_id
      order by created_at desc
    ) as rn
  from public.profiles
  where deleted_at is null
)
delete from public.profiles p
using ranked r
where p.id = r.id
  and r.rn > 1;

create unique index if not exists profiles_org_account_unique
  on public.profiles (org_id, account_id)
  where deleted_at is null;
