create table public.user_onboarding_status (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  current_step text,
  last_completed_step text,
  progress jsonb,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (org_id, profile_id)
);

alter table public.user_onboarding_status
  enable row level security;

create policy "profile owners can manage onboarding status"
  on public.user_onboarding_status
  for all
  using (
    deleted_at is null
    and (
      public.is_profile_owner(profile_id)
      or public.is_org_admin(org_id)
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_profile_owner(profile_id)
      or public.is_org_admin(org_id)
    )
  );

create policy "org admins can read onboarding status"
  on public.user_onboarding_status
  for select
  using (
    deleted_at is null
    and public.is_org_admin(org_id)
  );

alter table public.user_onboarding_status
  alter column updated_at set default now();
