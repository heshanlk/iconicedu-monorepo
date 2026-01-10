-- add unique guardian ownership constraint on families
create unique index if not exists families_org_guardian_unique
  on public.families (org_id, created_by)
  where created_by is not null;

-- ensure family link invites are removed when any referenced account is deleted
alter table public.family_link_invites
  drop constraint if exists family_link_invites_accepted_by_account_id_fkey;

alter table public.family_link_invites
  add constraint family_link_invites_accepted_by_account_id_fkey
  foreign key (accepted_by_account_id)
  references public.accounts(id)
  on delete cascade;
