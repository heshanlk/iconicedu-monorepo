-- Ensure families are deleted when their owning account goes away.

alter table public.families
  drop constraint if exists families_created_by_fkey;

alter table public.families
  add constraint families_created_by_fkey
  foreign key (created_by)
  references public.accounts(id)
  on delete cascade;
