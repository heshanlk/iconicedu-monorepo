alter table public.accounts
  add column if not exists archived_at timestamptz;
