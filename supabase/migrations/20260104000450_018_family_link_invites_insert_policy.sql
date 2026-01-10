-- Add policy to allow guardians who issue invites to insert into family_link_invites

drop policy if exists "family link invites insert by guardian" on public.family_link_invites;

create policy "family link invites insert by guardian"
  on public.family_link_invites
  for insert
  with check (
    auth.uid() is not null
    and exists (
      select 1
      from public.accounts acc
      where acc.id = created_by_account_id
        and acc.org_id = org_id
        and acc.auth_user_id = auth.uid()
    )
  );
