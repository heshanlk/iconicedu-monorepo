-- Refine guardian access to child_profiles using the account_id relationship.
drop policy if exists "child profiles update by guardian or owner" on public.child_profiles;

create policy "child profiles update by guardian or owner"
  on public.child_profiles
  for update
  using (
    deleted_at is null
    and (
      public.is_profile_owner(child_profiles.profile_id)
      or exists (
        select 1
        from public.family_links fl
        join public.accounts child_account on child_account.id = fl.child_account_id
        join public.profiles child_profile on child_profile.account_id = child_account.id
        where fl.guardian_account_id = public.current_account_id()
          and child_profile.id = child_profiles.profile_id
          and fl.org_id = child_profiles.org_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
      )
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_profile_owner(child_profiles.profile_id)
      or exists (
        select 1
        from public.family_links fl
        join public.accounts child_account on child_account.id = fl.child_account_id
        join public.profiles child_profile on child_profile.account_id = child_account.id
        where fl.guardian_account_id = public.current_account_id()
          and child_profile.id = child_profiles.profile_id
          and fl.org_id = child_profiles.org_id
          and fl.deleted_at is null
          and child_account.deleted_at is null
      )
    )
  );
