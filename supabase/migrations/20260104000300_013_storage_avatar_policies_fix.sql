create or replace function public.storage_avatar_org_id(path text)
returns uuid
language sql
immutable
as $$
  select nullif(split_part(path, '/', 1), '')::uuid;
$$;

create or replace function public.storage_avatar_profile_id(path text)
returns uuid
language sql
immutable
as $$
  select nullif(split_part(path, '/', 2), '')::uuid;
$$;

drop policy if exists "avatars: insert own folder" on storage.objects;
drop policy if exists "avatars: update own folder" on storage.objects;
drop policy if exists "avatars: org members read" on storage.objects;

create policy "avatars: insert own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'public-avatars'
  and exists (
    select 1
    from public.profiles p
    join public.accounts a on a.id = p.account_id
    where p.id = public.storage_avatar_profile_id(name)
      and p.org_id = public.storage_avatar_org_id(name)
      and a.auth_user_id = auth.uid()
      and p.deleted_at is null
      and a.deleted_at is null
  )
);

create policy "avatars: update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'public-avatars'
  and exists (
    select 1
    from public.profiles p
    join public.accounts a on a.id = p.account_id
    where p.id = public.storage_avatar_profile_id(name)
      and p.org_id = public.storage_avatar_org_id(name)
      and a.auth_user_id = auth.uid()
      and p.deleted_at is null
      and a.deleted_at is null
  )
)
with check (
  bucket_id = 'public-avatars'
  and exists (
    select 1
    from public.profiles p
    join public.accounts a on a.id = p.account_id
    where p.id = public.storage_avatar_profile_id(name)
      and p.org_id = public.storage_avatar_org_id(name)
      and a.auth_user_id = auth.uid()
      and p.deleted_at is null
      and a.deleted_at is null
  )
);

create policy "avatars: org members read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'public-avatars'
  and public.is_org_member(public.storage_avatar_org_id(name))
  and exists (
    select 1
    from public.profiles p
    where p.id = public.storage_avatar_profile_id(name)
      and p.org_id = public.storage_avatar_org_id(name)
      and p.deleted_at is null
  )
);
