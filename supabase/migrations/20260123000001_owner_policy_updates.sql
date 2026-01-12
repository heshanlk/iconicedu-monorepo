-- Allow educators and staff to manage their own profile data via RLS

-- Educator profiles
DROP POLICY IF EXISTS "educator profiles manage by admin" ON public.educator_profiles;
CREATE POLICY "educator profiles manage by admin"
  ON public.educator_profiles
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );

-- Educator subjects, grade levels, tags, and badges
DROP POLICY IF EXISTS "educator subjects manage by admin" ON public.educator_profile_subjects;
CREATE POLICY "educator subjects manage by admin"
  ON public.educator_profile_subjects
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );

DROP POLICY IF EXISTS "educator grade levels manage by admin" ON public.educator_profile_grade_levels;
CREATE POLICY "educator grade levels manage by admin"
  ON public.educator_profile_grade_levels
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );

DROP POLICY IF EXISTS "educator tags manage by admin" ON public.educator_profile_curriculum_tags;
CREATE POLICY "educator tags manage by admin"
  ON public.educator_profile_curriculum_tags
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );

DROP POLICY IF EXISTS "educator badges manage by admin" ON public.educator_profile_badges;
CREATE POLICY "educator badges manage by admin"
  ON public.educator_profile_badges
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );

-- Staff profiles and specialties
DROP POLICY IF EXISTS "staff profiles manage by admin" ON public.staff_profiles;
CREATE POLICY "staff profiles manage by admin"
  ON public.staff_profiles
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );

DROP POLICY IF EXISTS "staff specialties manage by admin" ON public.staff_profile_specialties;
CREATE POLICY "staff specialties manage by admin"
  ON public.staff_profile_specialties
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );

-- Child profile grade levels
DROP POLICY IF EXISTS "child grade manage by admin" ON public.child_profile_grade_level;
CREATE POLICY "child grade manage by admin"
  ON public.child_profile_grade_level
  FOR ALL
  USING (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  )
  WITH CHECK (
    deleted_at IS NULL
    AND (
      public.is_profile_owner(profile_id)
      OR public.is_org_admin(org_id)
    )
  );
