-- Allow educator profile owners to manage their own subjects, grades, tags, and badges.

drop policy if exists "educator subjects read by org" on public.educator_profile_subjects;
drop policy if exists "educator subjects manage by admin" on public.educator_profile_subjects;

drop policy if exists "educator grade levels read by org" on public.educator_profile_grade_levels;
drop policy if exists "educator grade levels manage by admin" on public.educator_profile_grade_levels;

drop policy if exists "educator tags read by org" on public.educator_profile_curriculum_tags;
drop policy if exists "educator tags manage by admin" on public.educator_profile_curriculum_tags;

drop policy if exists "educator badges read by org" on public.educator_profile_badges;
drop policy if exists "educator badges manage by admin" on public.educator_profile_badges;

create policy "educator subjects read by org or owner"
  on public.educator_profile_subjects
  for select
  using (
    deleted_at is null
    and (
      public.is_org_member(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator subjects manage by admin or owner"
  on public.educator_profile_subjects
  for all
  using (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator grade levels read by org or owner"
  on public.educator_profile_grade_levels
  for select
  using (
    deleted_at is null
    and (
      public.is_org_member(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator grade levels manage by admin or owner"
  on public.educator_profile_grade_levels
  for all
  using (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator tags read by org or owner"
  on public.educator_profile_curriculum_tags
  for select
  using (
    deleted_at is null
    and (
      public.is_org_member(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator tags manage by admin or owner"
  on public.educator_profile_curriculum_tags
  for all
  using (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator badges read by org or owner"
  on public.educator_profile_badges
  for select
  using (
    deleted_at is null
    and (
      public.is_org_member(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator badges manage by admin or owner"
  on public.educator_profile_badges
  for all
  using (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_org_admin(org_id)
      or public.is_profile_owner(profile_id)
    )
  );
