-- Allow educator profile owners to manage their own row in addition to org admins.

drop policy if exists "educator profiles read by org" on public.educator_profiles;
drop policy if exists "educator profiles manage by admin" on public.educator_profiles;

create policy "educator profiles read by org or owner"
  on public.educator_profiles
  for select
  using (
    deleted_at is null
    and (
      public.is_org_member(org_id)
      or public.is_profile_owner(profile_id)
    )
  );

create policy "educator profiles manage by admin or owner"
  on public.educator_profiles
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
