create table public.educator_availabilities (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  class_types text[] not null default '{}',
  weekly_commitment integer not null default 0,
  availability jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);
