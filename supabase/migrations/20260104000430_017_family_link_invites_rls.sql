-- Enable row level security on family_link_invites
alter table public.family_link_invites enable row level security;

-- Policies for family_link_invites

drop policy if exists "org members can read family link invites" on public.family_link_invites;
drop policy if exists "org members can write family link invites" on public.family_link_invites;

create policy "family link invites read by org"
  on public.family_link_invites
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "family link invites manage by admin"
  on public.family_link_invites
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));
