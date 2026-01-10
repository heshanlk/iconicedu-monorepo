-- Create enum types for family link invites if they do not already exist
do $$
begin
  if not exists (select 1 from pg_type where typname = 'family_link_invite_role') then
    create type public.family_link_invite_role as enum ('guardian', 'child');
  end if;
  if not exists (select 1 from pg_type where typname = 'family_link_invite_status') then
    create type public.family_link_invite_status as enum ('pending', 'accepted', 'revoked', 'expired');
  end if;
end $$;

-- Create table for tracking family link invitations
create table if not exists public.family_link_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  invited_role public.family_link_invite_role not null,
  invited_email text,
  invited_phone_e164 text,
  invite_code_hash text,
  created_by_account_id uuid not null references public.accounts(id) on delete cascade,
  status public.family_link_invite_status not null default 'pending',
  expires_at timestamptz,
  accepted_by_account_id uuid references public.accounts(id) on delete set null,
  accepted_at timestamptz,
  max_uses integer not null default 1,
  uses integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);
