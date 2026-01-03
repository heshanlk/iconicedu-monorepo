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

create or replace function public.is_profile_owner(_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.accounts a on a.id = p.account_id
    where p.id = _profile_id
      and a.auth_user_id = auth.uid()
      and p.deleted_at is null
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

create or replace function public.is_learning_space_participant(_learning_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.learning_space_participants lsp
    join public.profiles p on p.id = lsp.profile_id
    join public.accounts a on a.id = p.account_id
    where lsp.learning_space_id = _learning_space_id
      and a.auth_user_id = auth.uid()
      and lsp.deleted_at is null
      and p.deleted_at is null
      and a.deleted_at is null
  );
$$;

create or replace function public.can_manage_learning_space(_learning_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.learning_spaces ls
    where ls.id = _learning_space_id
      and public.is_org_admin(ls.org_id)
      and ls.deleted_at is null
  )
  or exists (
    select 1
    from public.user_roles ur
    join public.accounts a on a.id = ur.account_id
    join public.learning_spaces ls on ls.org_id = ur.org_id
    where ls.id = _learning_space_id
      and a.auth_user_id = auth.uid()
      and ur.role_key in ('staff', 'educator')
      and ur.deleted_at is null
      and a.deleted_at is null
      and ls.deleted_at is null
  );
$$;

create or replace function public.is_schedule_participant(_schedule_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_schedule_participants sp
    join public.profiles p on p.id = sp.profile_id
    join public.accounts a on a.id = p.account_id
    where sp.schedule_id = _schedule_id
      and a.auth_user_id = auth.uid()
      and sp.deleted_at is null
      and p.deleted_at is null
      and a.deleted_at is null
  );
$$;

create or replace function public.can_manage_schedule(_schedule_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_schedules cs
    where cs.id = _schedule_id
      and public.is_org_admin(cs.org_id)
      and cs.deleted_at is null
  )
  or exists (
    select 1
    from public.user_roles ur
    join public.accounts a on a.id = ur.account_id
    join public.class_schedules cs on cs.org_id = ur.org_id
    where cs.id = _schedule_id
      and a.auth_user_id = auth.uid()
      and ur.role_key in ('staff', 'educator')
      and ur.deleted_at is null
      and a.deleted_at is null
      and cs.deleted_at is null
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
