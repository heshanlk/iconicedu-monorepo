-- Allow guardians who created an invite to delete it when their auth user owns the account.

drop policy if exists "family link invites delete by guardian" on public.family_link_invites;

create policy "family link invites delete by guardian"
  on public.family_link_invites
  for delete
  using (
    auth.uid() is not null
    and exists (
      select 1
      from public.accounts acc
      where acc.id = created_by_account_id
        and acc.org_id = org_id
        and acc.auth_user_id = auth.uid()
    )
  );
