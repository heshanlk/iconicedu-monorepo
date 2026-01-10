-- Allow guardians connected via family links to manage child profiles.

drop policy if exists "child profiles manage by guardian" on public.child_profiles;

create policy "child profiles insert by guardian"
  on public.child_profiles
  for insert
  with check (
    child_profiles.deleted_at is null
    and (
      public.is_org_admin(child_profiles.org_id)
      or exists (
        select 1
        from public.family_links fl
        join public.accounts child_account on child_account.id = fl.child_account_id
        join public.profiles child_profile on child_profile.account_id = child_account.id
        where fl.org_id = child_profiles.org_id
          and fl.guardian_account_id = public.current_account_id()
          and child_profile.id = child_profiles.profile_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
          and child_profile.deleted_at is null
      )
    )
  );

create policy "child profiles update by guardian"
  on public.child_profiles
  for update
  using (
    child_profiles.deleted_at is null
    and (
      public.is_org_admin(child_profiles.org_id)
      or public.is_profile_owner(child_profiles.profile_id)
      or exists (
        select 1
        from public.family_links fl
        join public.accounts child_account on child_account.id = fl.child_account_id
        join public.profiles child_profile on child_profile.account_id = child_account.id
        where fl.org_id = child_profiles.org_id
          and fl.guardian_account_id = public.current_account_id()
          and child_profile.id = child_profiles.profile_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
          and child_profile.deleted_at is null
      )
    )
  )
  with check (
    child_profiles.deleted_at is null
    and (
      public.is_org_admin(child_profiles.org_id)
      or public.is_profile_owner(child_profiles.profile_id)
      or exists (
        select 1
        from public.family_links fl
        join public.accounts child_account on child_account.id = fl.child_account_id
        join public.profiles child_profile on child_profile.account_id = child_account.id
        where fl.org_id = child_profiles.org_id
          and fl.guardian_account_id = public.current_account_id()
          and child_profile.id = child_profiles.profile_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
          and child_profile.deleted_at is null
      )
    )
  );
