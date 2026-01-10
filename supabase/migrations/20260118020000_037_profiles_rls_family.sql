-- Profiles RLS: admin owns all, owners and guardians limited, all org members may read.
drop policy if exists "profiles update self admin or guardian child" on public.profiles;
drop policy if exists "profiles read by org" on public.profiles;
drop policy if exists "profiles insert admin" on public.profiles;
drop policy if exists "profiles delete admin" on public.profiles;

create policy "profiles read by org"
  on public.profiles
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "profiles insert admin"
  on public.profiles
  for insert
  with check (public.is_org_admin(org_id));

create policy "profiles delete admin"
  on public.profiles
  for delete
  using (public.is_org_admin(org_id));

create policy "profiles update self admin or guardian child"
  on public.profiles
  for update
  using (
    deleted_at is null
    and (
      public.is_profile_owner(id)
      or public.is_org_admin(org_id)
      or exists (
        select 1
        from public.family_links fl
        join public.accounts child_account on child_account.id = fl.child_account_id
        where fl.guardian_account_id = public.current_account_id()
          and child_account.id = profiles.account_id
          and fl.org_id = profiles.org_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
      )
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_profile_owner(id)
      or public.is_org_admin(org_id)
      or exists (
        select 1
        from public.family_links fl
        join public.accounts child_account on child_account.id = fl.child_account_id
        where fl.guardian_account_id = public.current_account_id()
          and child_account.id = profiles.account_id
          and fl.org_id = profiles.org_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
      )
    )
  );
