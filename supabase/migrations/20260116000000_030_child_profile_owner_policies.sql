-- Ensure profile owners (children) plus guardians via family_links and admins can fully manage child profile data.

drop policy if exists "child profiles insert by guardian" on public.child_profiles;
drop policy if exists "child profiles insert by child" on public.child_profiles;
drop policy if exists "child profiles update by guardian" on public.child_profiles;
drop policy if exists "child profiles delete by guardian or owner" on public.child_profiles;

create policy "child profiles insert by owner or guardian"
  on public.child_profiles
  for insert
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

create policy "child profiles update by owner or guardian"
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
        where fl.org_id = child_profiles.org_id
          and fl.guardian_account_id = public.current_account_id()
          and fl.child_account_id = (
            select account_id
            from public.profiles
            where id = child_profiles.profile_id
          )
          and fl.deleted_at is null
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
        where fl.org_id = child_profiles.org_id
          and fl.guardian_account_id = public.current_account_id()
          and fl.child_account_id = (
            select account_id
            from public.profiles
            where id = child_profiles.profile_id
          )
          and fl.deleted_at is null
      )
    )
  );

create policy "child profiles delete by owner or guardian"
  on public.child_profiles
  for delete
  using (
    child_profiles.deleted_at is null
    and (
      public.is_org_admin(child_profiles.org_id)
      or public.is_profile_owner(child_profiles.profile_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profiles.org_id
          and fl.guardian_account_id = public.current_account_id()
          and fl.child_account_id = (
            select account_id
            from public.profiles
            where id = child_profiles.profile_id
          )
          and fl.deleted_at is null
      )
    )
  );

drop policy if exists "child grade insert by guardian or owner" on public.child_profile_grade_level;
drop policy if exists "child grade update by guardian or owner" on public.child_profile_grade_level;
drop policy if exists "child grade delete by guardian or owner" on public.child_profile_grade_level;

create policy "child grade insert by owner or guardian"
  on public.child_profile_grade_level
  for insert
  with check (
    child_profile_grade_level.deleted_at is null
    and (
      public.is_org_admin(child_profile_grade_level.org_id)
      or public.is_profile_owner(child_profile_grade_level.profile_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profile_grade_level.org_id
          and fl.guardian_account_id = public.current_account_id()
          and fl.child_account_id = (
            select account_id
            from public.profiles
            where id = child_profile_grade_level.profile_id
          )
          and fl.deleted_at is null
      )
    )
  );

create policy "child grade update by owner or guardian"
  on public.child_profile_grade_level
  for update
  using (
    child_profile_grade_level.deleted_at is null
    and (
      public.is_org_admin(child_profile_grade_level.org_id)
      or public.is_profile_owner(child_profile_grade_level.profile_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profile_grade_level.org_id
          and fl.guardian_account_id = public.current_account_id()
          and fl.child_account_id = (
            select account_id
            from public.profiles
            where id = child_profile_grade_level.profile_id
          )
          and fl.deleted_at is null
      )
    )
  )
  with check (
    child_profile_grade_level.deleted_at is null
    and (
      public.is_org_admin(child_profile_grade_level.org_id)
      or public.is_profile_owner(child_profile_grade_level.profile_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profile_grade_level.org_id
          and fl.guardian_account_id = public.current_account_id()
          and fl.child_account_id = (
            select account_id
            from public.profiles
            where id = child_profile_grade_level.profile_id
          )
          and fl.deleted_at is null
      )
    )
  );

create policy "child grade delete by owner or guardian"
  on public.child_profile_grade_level
  for delete
  using (
    child_profile_grade_level.deleted_at is null
    and (
      public.is_org_admin(child_profile_grade_level.org_id)
      or public.is_profile_owner(child_profile_grade_level.profile_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profile_grade_level.org_id
          and fl.guardian_account_id = public.current_account_id()
          and fl.child_account_id = (
            select account_id
            from public.profiles
            where id = child_profile_grade_level.profile_id
          )
          and fl.deleted_at is null
      )
    )
  );
