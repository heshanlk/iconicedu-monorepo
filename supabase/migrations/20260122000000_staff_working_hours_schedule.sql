alter table public.staff_profiles
  add column if not exists working_hours_schedule jsonb;

update public.staff_profiles
  set working_hours_schedule = to_jsonb(working_hours_rules)
  where working_hours_rules is not null;
