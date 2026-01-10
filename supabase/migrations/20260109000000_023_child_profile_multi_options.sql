alter table public.child_profiles
  add column if not exists interests text[] default '{}'::text[];

alter table public.child_profiles
  add column if not exists strengths text[] default '{}'::text[];

alter table public.child_profiles
  add column if not exists learning_preferences text[] default '{}'::text[];

alter table public.child_profiles
  add column if not exists motivation_styles text[] default '{}'::text[];

alter table public.child_profiles
  add column if not exists communication_styles text[] default '{}'::text[];
