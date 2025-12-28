create type app_role as enum (
  'guardian',
  'educator',
  'child',
  'advisor',
  'staff',
  'admin'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  app_role app_role not null default 'guardian',
  created_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  relation text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  class_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.channel_members (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_in_channel text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text,
  created_at timestamptz not null default now()
);

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_in_class text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.homework (
  id uuid primary key default gen_random_uuid(),
  class_session_id uuid not null references public.class_sessions(id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.homework_submissions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.homework(id) on delete cascade,
  child_id uuid not null references public.profiles(id),
  submitted_at timestamptz not null default now(),
  content text,
  status text not null default 'submitted'
);

create function public.current_app_role()
returns app_role
language sql
stable
as $$
  select coalesce(
    current_setting('request.jwt.claims', true)::jsonb->>'app_role',
    'guardian'
  )::app_role;
$$;

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.messages enable row level security;
alter table public.classes enable row level security;
alter table public.class_sessions enable row level security;
alter table public.enrollments enable row level security;
alter table public.homework enable row level security;
alter table public.homework_submissions enable row level security;

create policy "Users can select their own profile"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "Admins & staff can select all profiles"
  on public.profiles
  for select
  using (public.current_app_role() in ('admin', 'staff'));

create policy "Channel members can select channels"
  on public.channels
  for select
  using (
    exists (
      select 1 from public.channel_members cm
      where cm.channel_id = channels.id
        and cm.user_id = auth.uid()
    )
  );

create policy "Admin & staff can select all channels"
  on public.channels
  for select
  using (public.current_app_role() in ('admin', 'staff'));

create policy "Members can see channel members"
  on public.channel_members
  for select
  using (
    exists (
      select 1 from public.channel_members cm2
      where cm2.channel_id = channel_members.channel_id
        and cm2.user_id = auth.uid()
    )
  );

create policy "Admin & staff can select all channel members"
  on public.channel_members
  for select
  using (public.current_app_role() in ('admin', 'staff'));

create policy "Members can read messages"
  on public.messages
  for select
  using (
    exists (
      select 1 from public.channel_members cm
      where cm.channel_id = messages.channel_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Members can insert messages"
  on public.messages
  for insert
  with check (
    exists (
      select 1 from public.channel_members cm
      where cm.channel_id = messages.channel_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Users can update/delete own messages"
  on public.messages
  for update, delete
  using (
    user_id = auth.uid()
    or public.current_app_role() in ('admin', 'staff')
  );
