-- Tighten profile update policy for guardians linked via family links.
drop policy if exists "profiles update self admin or guardian child" on public.profiles;
drop policy if exists "profiles read by org" on public.profiles;

create policy "profiles read by org"
  on public.profiles
  for select
  using (
    deleted_at is null
    and (
      public.is_org_member(org_id)
    )
  );

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
        join public.profiles child_profile on child_profile.account_id = child_account.id
        where fl.guardian_account_id = public.current_account_id()
          and child_profile.id = profiles.id
          and fl.org_id = profiles.org_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
          and child_profile.deleted_at is null
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
        join public.profiles child_profile on child_profile.account_id = child_account.id
        where fl.guardian_account_id = public.current_account_id()
          and child_profile.id = profiles.id
          and fl.org_id = profiles.org_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
          and child_profile.deleted_at is null
      )
    )
  );
