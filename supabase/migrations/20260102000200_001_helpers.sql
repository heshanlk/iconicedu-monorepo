create or replace function public.current_account_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select a.id
  from public.accounts a
  where a.auth_user_id = auth.uid()
    and a.deleted_at is null
  limit 1
$$;

create or replace function public.is_org_member(_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.accounts a
    where a.org_id = _org_id
      and a.auth_user_id = auth.uid()
      and a.deleted_at is null
  );
$$;

create or replace function public.is_org_admin(_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.accounts a on a.id = ur.account_id
    where ur.org_id = _org_id
      and a.auth_user_id = auth.uid()
      and ur.role_key in ('owner', 'admin')
      and ur.deleted_at is null
      and a.deleted_at is null
  );
$$;

create or replace function public.is_channel_member(_channel_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.channel_members cm
    join public.profiles p on p.id = cm.profile_id
    join public.accounts a on a.id = p.account_id
    where cm.channel_id = _channel_id
      and a.auth_user_id = auth.uid()
      and cm.deleted_at is null
      and p.deleted_at is null
      and a.deleted_at is null
  );
$$;

create or replace function public.can_manage_channel(_channel_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.channels c
    where c.id = _channel_id
      and public.is_org_admin(c.org_id)
      and c.deleted_at is null
  )
  or exists (
    select 1
    from public.user_roles ur
    join public.accounts a on a.id = ur.account_id
    join public.channels c on c.org_id = ur.org_id
    where c.id = _channel_id
      and a.auth_user_id = auth.uid()
      and ur.role_key in ('staff', 'educator')
      and ur.deleted_at is null
      and a.deleted_at is null
      and c.deleted_at is null
  );
$$;

create or replace function public.can_access_message(_message_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.messages m
    where m.id = _message_id
      and m.deleted_at is null
      and public.is_channel_member(m.channel_id)
  );
$$;

create or replace function public.can_mutate_message(_message_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.messages m
    join public.profiles p on p.id = m.sender_profile_id
    join public.accounts a on a.id = p.account_id
    where m.id = _message_id
      and a.auth_user_id = auth.uid()
      and m.deleted_at is null
      and p.deleted_at is null
      and a.deleted_at is null
  )
  or exists (
    select 1
    from public.messages m
    join public.channels c on c.id = m.channel_id
    where m.id = _message_id
      and public.can_manage_channel(c.id)
      and m.deleted_at is null
  );
$$;
