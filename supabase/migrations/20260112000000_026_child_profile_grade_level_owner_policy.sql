-- Allow guardians via family_links and profile owners to manage child_profile_grade_level entries.

drop policy if exists "child grade manage by guardian" on public.child_profile_grade_level;

create policy "child grade insert by guardian"
  on public.child_profile_grade_level
  for insert
  with check (
    deleted_at is null
    and (
      public.is_org_admin(child_profile_grade_level.org_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profile_grade_level.org_id
          and fl.child_account_id = (
            select account_id from public.profiles where id = child_profile_grade_level.profile_id
          )
          and fl.guardian_account_id = public.current_account_id()
          and fl.deleted_at is null
      )
    )
  );

create policy "child grade update by guardian or owner"
  on public.child_profile_grade_level
  for update
  using (
    deleted_at is null
    and (
      public.is_org_admin(child_profile_grade_level.org_id)
      or public.is_profile_owner(child_profile_grade_level.profile_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profile_grade_level.org_id
          and fl.child_account_id = (
            select account_id from public.profiles where id = child_profile_grade_level.profile_id
          )
          and fl.guardian_account_id = public.current_account_id()
          and fl.deleted_at is null
      )
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_org_admin(child_profile_grade_level.org_id)
      or public.is_profile_owner(child_profile_grade_level.profile_id)
      or exists (
        select 1
        from public.family_links fl
        where fl.org_id = child_profile_grade_level.org_id
          and fl.child_account_id = (
            select account_id from public.profiles where id = child_profile_grade_level.profile_id
          )
          and fl.guardian_account_id = public.current_account_id()
          and fl.deleted_at is null
      )
    )
  );
