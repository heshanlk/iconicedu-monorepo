create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create or replace function public.is_org_member(_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.accounts a
    where a.org_id = _org_id
      and a.auth_user_id = auth.uid()
      and a.deleted_at is null
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.uuid_generate_v7()
returns uuid
language plpgsql
as $$
begin
  return gen_random_uuid();
end;
$$;

create type public.account_status as enum ('active', 'invited', 'suspended', 'deleted');
create type public.profile_kind as enum ('educator', 'guardian', 'child', 'staff', 'system');
create type public.role_key as enum ('owner', 'admin', 'educator', 'guardian', 'child', 'staff');
create type public.channel_kind as enum ('channel', 'dm', 'group_dm');
create type public.channel_visibility as enum ('private', 'public');
create type public.channel_purpose as enum ('learning-space', 'general', 'support', 'announcements');
create type public.channel_status as enum ('active', 'archived');
create type public.channel_posting_policy_kind as enum ('everyone', 'members-only', 'staff-only', 'read-only', 'owners_only');
create type public.channel_media_type as enum ('image');
create type public.channel_file_kind as enum ('file', 'design-file');
create type public.message_type as enum (
  'text',
  'image',
  'file',
  'design-file-update',
  'payment-reminder',
  'event-reminder',
  'feedback-request',
  'lesson-assignment',
  'progress-update',
  'session-booking',
  'session-complete',
  'session-summary',
  'homework-submission',
  'link-preview',
  'audio-recording'
);
create type public.message_visibility_type as enum ('all', 'sender-only', 'recipient-only', 'specific-users');
create type public.learning_space_kind as enum ('one_on_one', 'small_group', 'large_class');
create type public.learning_space_status as enum ('active', 'archived', 'completed', 'paused');
create type public.learning_space_link_status as enum ('active', 'inactive');
create type public.class_schedule_visibility as enum ('private', 'internal', 'class-members', 'public');
create type public.class_schedule_status as enum ('scheduled', 'cancelled', 'completed', 'rescheduled');
create type public.class_schedule_participant_role as enum ('educator', 'child', 'guardian', 'staff', 'observer');
create type public.class_schedule_participation_status as enum ('invited', 'accepted', 'declined', 'tentative');
create type public.recurrence_frequency as enum ('daily', 'weekly', 'monthly', 'yearly');
create type public.activity_group_key as enum (
  'homework',
  'message',
  'class',
  'reminder',
  'recording',
  'notes',
  'ai-summary',
  'payment',
  'survey',
  'complete-class'
);
create type public.activity_visibility as enum ('public', 'scope_only', 'direct');
create type public.activity_importance as enum ('normal', 'important', 'urgent');
create type public.inbox_tab_key as enum ('all', 'classes', 'payment', 'system');

create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text,
  phone_e164 text,
  whatsapp_e164 text,
  email_verified boolean not null default false,
  email_verified_at timestamptz,
  phone_verified boolean not null default false,
  phone_verified_at timestamptz,
  whatsapp_verified boolean not null default false,
  whatsapp_verified_at timestamptz,
  preferred_contact_channels text[] null,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  role_key public.role_key not null,
  assigned_by uuid,
  assigned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, account_id, role_key)
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  kind public.profile_kind not null,
  display_name text not null,
  first_name text,
  last_name text,
  bio text,
  avatar_source text not null,
  avatar_url text,
  avatar_seed text,
  avatar_updated_at timestamptz,
  timezone text not null,
  locale text,
  languages_spoken text[],
  status public.account_status,
  country_code text,
  country_name text,
  region text,
  city text,
  postal_code text,
  notes_internal text,
  lead_source text,
  ui_theme_key text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.educator_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  headline text,
  education text,
  experience_years integer,
  certifications jsonb,
  joined_date timestamptz,
  age_groups_comfortable_with text[],
  identity_verification_status text,
  average_rating numeric,
  total_reviews integer,
  featured_video_intro_url text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.child_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  birth_year integer,
  school_name text,
  school_year text,
  confidence_level text,
  communication_style text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.guardian_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  joined_date timestamptz,
  session_notes_visibility text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.staff_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  department text,
  manager_staff_id uuid,
  job_title text,
  permissions_scope text,
  working_hours_rules text[],
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.profile_presence (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  state_text text,
  state_emoji text,
  state_expires_at timestamptz,
  live_status text,
  display_status text,
  last_seen_at timestamptz,
  presence_loaded boolean default false,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id)
);

create table public.notification_preferences (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  pref_key text not null,
  channels text[] not null,
  muted boolean,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id, pref_key)
);

create table public.educator_profile_subjects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.educator_profiles(profile_id) on delete cascade,
  subject text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id, subject)
);

create table public.educator_profile_grade_levels (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.educator_profiles(profile_id) on delete cascade,
  grade_id text not null,
  grade_label text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id, grade_id)
);

create table public.child_profile_grade_level (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.child_profiles(profile_id) on delete cascade,
  grade_id text not null,
  grade_label text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id)
);

create table public.educator_profile_curriculum_tags (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.educator_profiles(profile_id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id, tag)
);

create table public.educator_profile_badges (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.educator_profiles(profile_id) on delete cascade,
  badge text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id, badge)
);

create table public.staff_profile_specialties (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  profile_id uuid not null references public.staff_profiles(profile_id) on delete cascade,
  specialty text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, profile_id, specialty)
);

create table public.families (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.family_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  guardian_account_id uuid not null references public.accounts(id) on delete cascade,
  child_account_id uuid not null references public.accounts(id) on delete cascade,
  relation text not null,
  permissions_scope text[],
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, family_id, guardian_account_id, child_account_id)
);

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  kind public.channel_kind not null,
  topic text not null,
  icon_key text,
  description text,
  visibility public.channel_visibility not null,
  purpose public.channel_purpose not null,
  status public.channel_status not null default 'active',
  dm_key text,
  posting_policy_kind public.channel_posting_policy_kind not null default 'members-only',
  allow_threads boolean default true,
  allow_reactions boolean default true,
  primary_entity_kind text,
  primary_entity_id uuid,
  created_by_profile_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.channel_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  role_in_channel text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, channel_id, profile_id)
);

create table public.channel_capabilities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  capability text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, channel_id, capability)
);

create table public.channel_read_state (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  last_read_message_id uuid,
  last_read_at timestamptz,
  unread_count integer,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, channel_id, account_id)
);

create table public.threads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  parent_message_id uuid not null,
  snippet text,
  author_id uuid,
  author_name text,
  message_count integer not null default 0,
  last_reply_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.thread_participants (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  thread_id uuid not null references public.threads(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, thread_id, profile_id)
);

create table public.thread_read_state (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  thread_id uuid not null references public.threads(id) on delete cascade,
  channel_id uuid references public.channels(id),
  account_id uuid not null references public.accounts(id) on delete cascade,
  last_read_message_id uuid,
  last_read_at timestamptz,
  unread_count integer,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, thread_id, account_id)
);

create table public.messages (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id),
  type public.message_type not null,
  created_at timestamptz not null default now(),
  visibility_type public.message_visibility_type not null default 'all',
  visibility_user_id uuid,
  visibility_user_ids uuid[],
  is_edited boolean default false,
  edited_at timestamptz,
  is_saved boolean default false,
  is_hidden boolean default false,
  thread_id uuid references public.threads(id),
  thread_parent_id uuid references public.messages(id),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_text (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_image (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_file (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_design_file_update (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_payment_reminder (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_event_reminder (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_feedback_request (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_lesson_assignment (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_progress_update (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_session_booking (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_session_complete (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_session_summary (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_homework_submission (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_link_preview (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_audio_recording (
  message_id uuid primary key references public.messages(id) on delete cascade,
  org_id uuid not null references public.orgs(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.message_reactions (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  message_id uuid not null references public.messages(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, message_id, account_id, emoji)
);

create table public.message_reaction_counts (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  message_id uuid not null references public.messages(id) on delete cascade,
  emoji text not null,
  count integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, message_id, emoji)
);

create table public.channel_media (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  message_id uuid references public.messages(id),
  sender_profile_id uuid references public.profiles(id),
  type public.channel_media_type not null default 'image',
  url text not null,
  name text,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.channel_files (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  message_id uuid references public.messages(id),
  sender_profile_id uuid references public.profiles(id),
  kind public.channel_file_kind not null,
  url text not null,
  name text not null,
  mime_type text,
  size integer,
  tool text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.learning_spaces (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  kind public.learning_space_kind not null,
  status public.learning_space_status not null default 'active',
  title text not null,
  icon_key text,
  subject text,
  description text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  archived_at timestamptz,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.learning_space_channels (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  learning_space_id uuid not null references public.learning_spaces(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, learning_space_id, channel_id)
);

create table public.learning_space_participants (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  learning_space_id uuid not null references public.learning_spaces(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, learning_space_id, profile_id)
);

create table public.learning_space_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  learning_space_id uuid not null references public.learning_spaces(id) on delete cascade,
  label text not null,
  icon_key text,
  url text,
  status public.learning_space_link_status,
  hidden boolean default false,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  title text not null,
  description text,
  location text,
  meeting_link text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text,
  status public.class_schedule_status not null default 'scheduled',
  visibility public.class_schedule_visibility not null,
  theme_key text,
  source_kind text not null,
  source_learning_space_id uuid,
  source_channel_id uuid,
  source_session_id uuid,
  source_owner_user_id uuid,
  source_created_by_user_id uuid,
  source_related_learning_space_id uuid,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.class_schedule_participants (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  schedule_id uuid not null references public.class_schedules(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  role public.class_schedule_participant_role not null,
  status public.class_schedule_participation_status,
  display_name text,
  avatar_url text,
  theme_key text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.class_schedule_recurrence (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  schedule_id uuid not null references public.class_schedules(id) on delete cascade,
  frequency public.recurrence_frequency not null,
  interval integer,
  by_weekday text[],
  count integer,
  until timestamptz,
  timezone text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.class_schedule_recurrence_exceptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  recurrence_id uuid not null references public.class_schedule_recurrence(id) on delete cascade,
  occurrence_key timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.class_schedule_recurrence_overrides (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  recurrence_id uuid not null references public.class_schedule_recurrence(id) on delete cascade,
  occurrence_key timestamptz not null,
  patch jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.activity_feed_items (
  id uuid primary key default uuid_generate_v7(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  kind text not null,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  tab_key public.inbox_tab_key not null,
  audience jsonb not null,
  verb text not null,
  actor_profile_id uuid references public.profiles(id),
  refs jsonb,
  group_key text,
  group_type public.activity_group_key,
  is_collapsed boolean,
  sub_activity_count integer,
  content jsonb not null,
  summary text,
  preview jsonb,
  action_button jsonb,
  expanded_content text,
  importance public.activity_importance,
  is_read boolean,
  metadata jsonb,
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid
);

create table public.activity_feed_group_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  group_id uuid not null references public.activity_feed_items(id) on delete cascade,
  item_id uuid not null references public.activity_feed_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  unique (org_id, group_id, item_id)
);

create index on public.accounts (org_id);
create unique index on public.accounts (org_id, email) where email is not null;
create unique index on public.accounts (org_id, phone_e164) where phone_e164 is not null;
create unique index on public.accounts (org_id, whatsapp_e164) where whatsapp_e164 is not null;
create index on public.user_roles (org_id, account_id);
create index on public.profiles (org_id, account_id);
create index on public.educator_profiles (org_id, profile_id);
create index on public.child_profiles (org_id, profile_id);
create index on public.guardian_profiles (org_id, profile_id);
create index on public.staff_profiles (org_id, profile_id);
create index on public.profile_presence (org_id, profile_id);
create index on public.notification_preferences (org_id, profile_id, pref_key);
create index on public.educator_profile_subjects (org_id, profile_id);
create index on public.educator_profile_grade_levels (org_id, profile_id);
create index on public.child_profile_grade_level (org_id, profile_id);
create index on public.educator_profile_curriculum_tags (org_id, profile_id);
create index on public.educator_profile_badges (org_id, profile_id);
create index on public.staff_profile_specialties (org_id, profile_id);
create index on public.channels (org_id, kind);
create index on public.channel_members (channel_id, profile_id);
create index on public.channel_capabilities (org_id, channel_id);
create index on public.messages (org_id, channel_id, created_at desc);
create index on public.messages (channel_id, created_at desc);
create index on public.messages (thread_id);
create index on public.messages (thread_parent_id);
create index on public.message_reactions (message_id);
create index on public.message_reaction_counts (message_id);
create index on public.message_text (org_id);
create index on public.message_image (org_id);
create index on public.message_file (org_id);
create index on public.message_design_file_update (org_id);
create index on public.message_payment_reminder (org_id);
create index on public.message_event_reminder (org_id);
create index on public.message_feedback_request (org_id);
create index on public.message_lesson_assignment (org_id);
create index on public.message_progress_update (org_id);
create index on public.message_session_booking (org_id);
create index on public.message_session_complete (org_id);
create index on public.message_session_summary (org_id);
create index on public.message_homework_submission (org_id);
create index on public.message_link_preview (org_id);
create index on public.message_audio_recording (org_id);
create index on public.learning_spaces (org_id, status);
create index on public.class_schedules (org_id, start_at);
create index on public.activity_feed_items (org_id, occurred_at desc);

alter table public.orgs enable row level security;
alter table public.accounts enable row level security;
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.educator_profiles enable row level security;
alter table public.child_profiles enable row level security;
alter table public.guardian_profiles enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.profile_presence enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.educator_profile_subjects enable row level security;
alter table public.educator_profile_grade_levels enable row level security;
alter table public.child_profile_grade_level enable row level security;
alter table public.educator_profile_curriculum_tags enable row level security;
alter table public.educator_profile_badges enable row level security;
alter table public.staff_profile_specialties enable row level security;
alter table public.families enable row level security;
alter table public.family_links enable row level security;
alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.channel_capabilities enable row level security;
alter table public.channel_read_state enable row level security;
alter table public.threads enable row level security;
alter table public.thread_participants enable row level security;
alter table public.thread_read_state enable row level security;
alter table public.messages enable row level security;
alter table public.message_text enable row level security;
alter table public.message_image enable row level security;
alter table public.message_file enable row level security;
alter table public.message_design_file_update enable row level security;
alter table public.message_payment_reminder enable row level security;
alter table public.message_event_reminder enable row level security;
alter table public.message_feedback_request enable row level security;
alter table public.message_lesson_assignment enable row level security;
alter table public.message_progress_update enable row level security;
alter table public.message_session_booking enable row level security;
alter table public.message_session_complete enable row level security;
alter table public.message_session_summary enable row level security;
alter table public.message_homework_submission enable row level security;
alter table public.message_link_preview enable row level security;
alter table public.message_audio_recording enable row level security;
alter table public.message_reactions enable row level security;
alter table public.message_reaction_counts enable row level security;
alter table public.channel_media enable row level security;
alter table public.channel_files enable row level security;
alter table public.learning_spaces enable row level security;
alter table public.learning_space_channels enable row level security;
alter table public.learning_space_participants enable row level security;
alter table public.learning_space_links enable row level security;
alter table public.class_schedules enable row level security;
alter table public.class_schedule_participants enable row level security;
alter table public.class_schedule_recurrence enable row level security;
alter table public.class_schedule_recurrence_exceptions enable row level security;
alter table public.class_schedule_recurrence_overrides enable row level security;
alter table public.activity_feed_items enable row level security;
alter table public.activity_feed_group_members enable row level security;

create policy "org members can read orgs"
  on public.orgs
  for select
  using (public.is_org_member(id));

create policy "org members can read accounts"
  on public.accounts
  for select
  using (public.is_org_member(org_id));

create policy "org members can write accounts"
  on public.accounts
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read roles"
  on public.user_roles
  for select
  using (public.is_org_member(org_id));

create policy "org members can write roles"
  on public.user_roles
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read profiles"
  on public.profiles
  for select
  using (public.is_org_member(org_id));

create policy "org members can write profiles"
  on public.profiles
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read educator profiles"
  on public.educator_profiles
  for select
  using (public.is_org_member(org_id));

create policy "org members can write educator profiles"
  on public.educator_profiles
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read child profiles"
  on public.child_profiles
  for select
  using (public.is_org_member(org_id));

create policy "org members can write child profiles"
  on public.child_profiles
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read guardian profiles"
  on public.guardian_profiles
  for select
  using (public.is_org_member(org_id));

create policy "org members can write guardian profiles"
  on public.guardian_profiles
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read staff profiles"
  on public.staff_profiles
  for select
  using (public.is_org_member(org_id));

create policy "org members can write staff profiles"
  on public.staff_profiles
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read profile presence"
  on public.profile_presence
  for select
  using (public.is_org_member(org_id));

create policy "org members can write profile presence"
  on public.profile_presence
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read notification preferences"
  on public.notification_preferences
  for select
  using (public.is_org_member(org_id));

create policy "org members can write notification preferences"
  on public.notification_preferences
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read educator subjects"
  on public.educator_profile_subjects
  for select
  using (public.is_org_member(org_id));

create policy "org members can write educator subjects"
  on public.educator_profile_subjects
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read educator grade levels"
  on public.educator_profile_grade_levels
  for select
  using (public.is_org_member(org_id));

create policy "org members can write educator grade levels"
  on public.educator_profile_grade_levels
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read child grade level"
  on public.child_profile_grade_level
  for select
  using (public.is_org_member(org_id));

create policy "org members can write child grade level"
  on public.child_profile_grade_level
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read educator curriculum tags"
  on public.educator_profile_curriculum_tags
  for select
  using (public.is_org_member(org_id));

create policy "org members can write educator curriculum tags"
  on public.educator_profile_curriculum_tags
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read educator badges"
  on public.educator_profile_badges
  for select
  using (public.is_org_member(org_id));

create policy "org members can write educator badges"
  on public.educator_profile_badges
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read staff specialties"
  on public.staff_profile_specialties
  for select
  using (public.is_org_member(org_id));

create policy "org members can write staff specialties"
  on public.staff_profile_specialties
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read families"
  on public.families
  for select
  using (public.is_org_member(org_id));

create policy "org members can write families"
  on public.families
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read family links"
  on public.family_links
  for select
  using (public.is_org_member(org_id));

create policy "org members can write family links"
  on public.family_links
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read channels"
  on public.channels
  for select
  using (public.is_org_member(org_id));

create policy "org members can write channels"
  on public.channels
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read channel capabilities"
  on public.channel_capabilities
  for select
  using (public.is_org_member(org_id));

create policy "org members can write channel capabilities"
  on public.channel_capabilities
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "channel members can read channel members"
  on public.channel_members
  for select
  using (
    exists (
      select 1
      from public.channel_members cm
      join public.profiles p on p.id = cm.profile_id
      join public.accounts a on a.id = p.account_id
      where cm.channel_id = channel_members.channel_id
        and a.auth_user_id = auth.uid()
    )
  );

create policy "org members can write channel members"
  on public.channel_members
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "channel members can read messages"
  on public.messages
  for select
  using (
    exists (
      select 1
      from public.channel_members cm
      join public.profiles p on p.id = cm.profile_id
      join public.accounts a on a.id = p.account_id
      where cm.channel_id = messages.channel_id
        and a.auth_user_id = auth.uid()
    )
  );

create policy "channel members can write messages"
  on public.messages
  for insert, update, delete
  using (
    exists (
      select 1
      from public.channel_members cm
      join public.profiles p on p.id = cm.profile_id
      join public.accounts a on a.id = p.account_id
      where cm.channel_id = messages.channel_id
        and a.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.channel_members cm
      join public.profiles p on p.id = cm.profile_id
      join public.accounts a on a.id = p.account_id
      where cm.channel_id = messages.channel_id
        and a.auth_user_id = auth.uid()
    )
  );

create policy "org members can read message payloads"
  on public.message_text
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message payloads"
  on public.message_text
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message images"
  on public.message_image
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message images"
  on public.message_image
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message files"
  on public.message_file
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message files"
  on public.message_file
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message design files"
  on public.message_design_file_update
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message design files"
  on public.message_design_file_update
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message payment reminders"
  on public.message_payment_reminder
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message payment reminders"
  on public.message_payment_reminder
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message event reminders"
  on public.message_event_reminder
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message event reminders"
  on public.message_event_reminder
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message feedback requests"
  on public.message_feedback_request
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message feedback requests"
  on public.message_feedback_request
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message lesson assignments"
  on public.message_lesson_assignment
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message lesson assignments"
  on public.message_lesson_assignment
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message progress updates"
  on public.message_progress_update
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message progress updates"
  on public.message_progress_update
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message session bookings"
  on public.message_session_booking
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message session bookings"
  on public.message_session_booking
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message session complete"
  on public.message_session_complete
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message session complete"
  on public.message_session_complete
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message session summary"
  on public.message_session_summary
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message session summary"
  on public.message_session_summary
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message homework submission"
  on public.message_homework_submission
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message homework submission"
  on public.message_homework_submission
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message link preview"
  on public.message_link_preview
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message link preview"
  on public.message_link_preview
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read message audio recording"
  on public.message_audio_recording
  for select
  using (public.is_org_member(org_id));

create policy "org members can write message audio recording"
  on public.message_audio_recording
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read misc tables"
  on public.channel_read_state
  for select
  using (public.is_org_member(org_id));

create policy "org members can write misc tables"
  on public.channel_read_state
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read threads"
  on public.threads
  for select
  using (public.is_org_member(org_id));

create policy "org members can write threads"
  on public.threads
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read thread participants"
  on public.thread_participants
  for select
  using (public.is_org_member(org_id));

create policy "org members can write thread participants"
  on public.thread_participants
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read thread read state"
  on public.thread_read_state
  for select
  using (public.is_org_member(org_id));

create policy "org members can write thread read state"
  on public.thread_read_state
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read reactions"
  on public.message_reactions
  for select
  using (public.is_org_member(org_id));

create policy "org members can write reactions"
  on public.message_reactions
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read reaction counts"
  on public.message_reaction_counts
  for select
  using (public.is_org_member(org_id));

create policy "org members can write reaction counts"
  on public.message_reaction_counts
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read channel media"
  on public.channel_media
  for select
  using (public.is_org_member(org_id));

create policy "org members can write channel media"
  on public.channel_media
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read channel files"
  on public.channel_files
  for select
  using (public.is_org_member(org_id));

create policy "org members can write channel files"
  on public.channel_files
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read learning spaces"
  on public.learning_spaces
  for select
  using (public.is_org_member(org_id));

create policy "org members can write learning spaces"
  on public.learning_spaces
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read learning space channels"
  on public.learning_space_channels
  for select
  using (public.is_org_member(org_id));

create policy "org members can write learning space channels"
  on public.learning_space_channels
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read learning space participants"
  on public.learning_space_participants
  for select
  using (public.is_org_member(org_id));

create policy "org members can write learning space participants"
  on public.learning_space_participants
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read learning space links"
  on public.learning_space_links
  for select
  using (public.is_org_member(org_id));

create policy "org members can write learning space links"
  on public.learning_space_links
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read schedules"
  on public.class_schedules
  for select
  using (public.is_org_member(org_id));

create policy "org members can write schedules"
  on public.class_schedules
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read schedule participants"
  on public.class_schedule_participants
  for select
  using (public.is_org_member(org_id));

create policy "org members can write schedule participants"
  on public.class_schedule_participants
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read schedule recurrence"
  on public.class_schedule_recurrence
  for select
  using (public.is_org_member(org_id));

create policy "org members can write schedule recurrence"
  on public.class_schedule_recurrence
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read schedule exceptions"
  on public.class_schedule_recurrence_exceptions
  for select
  using (public.is_org_member(org_id));

create policy "org members can write schedule exceptions"
  on public.class_schedule_recurrence_exceptions
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read schedule overrides"
  on public.class_schedule_recurrence_overrides
  for select
  using (public.is_org_member(org_id));

create policy "org members can write schedule overrides"
  on public.class_schedule_recurrence_overrides
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read activity feed"
  on public.activity_feed_items
  for select
  using (public.is_org_member(org_id));

create policy "org members can write activity feed"
  on public.activity_feed_items
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy "org members can read activity feed groups"
  on public.activity_feed_group_members
  for select
  using (public.is_org_member(org_id));

create policy "org members can write activity feed groups"
  on public.activity_feed_group_members
  for insert, update, delete
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create trigger set_updated_at_accounts
  before update on public.accounts
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_user_roles
  before update on public.user_roles
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_educator_profiles
  before update on public.educator_profiles
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_child_profiles
  before update on public.child_profiles
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_guardian_profiles
  before update on public.guardian_profiles
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_staff_profiles
  before update on public.staff_profiles
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_profile_presence
  before update on public.profile_presence
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_notification_preferences
  before update on public.notification_preferences
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_educator_profile_subjects
  before update on public.educator_profile_subjects
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_educator_profile_grade_levels
  before update on public.educator_profile_grade_levels
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_child_profile_grade_level
  before update on public.child_profile_grade_level
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_educator_profile_curriculum_tags
  before update on public.educator_profile_curriculum_tags
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_educator_profile_badges
  before update on public.educator_profile_badges
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_staff_profile_specialties
  before update on public.staff_profile_specialties
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_families
  before update on public.families
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_family_links
  before update on public.family_links
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_channels
  before update on public.channels
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_channel_members
  before update on public.channel_members
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_channel_capabilities
  before update on public.channel_capabilities
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_channel_read_state
  before update on public.channel_read_state
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_threads
  before update on public.threads
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_thread_participants
  before update on public.thread_participants
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_thread_read_state
  before update on public.thread_read_state
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_messages
  before update on public.messages
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_text
  before update on public.message_text
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_image
  before update on public.message_image
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_file
  before update on public.message_file
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_design_file_update
  before update on public.message_design_file_update
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_payment_reminder
  before update on public.message_payment_reminder
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_event_reminder
  before update on public.message_event_reminder
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_feedback_request
  before update on public.message_feedback_request
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_lesson_assignment
  before update on public.message_lesson_assignment
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_progress_update
  before update on public.message_progress_update
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_session_booking
  before update on public.message_session_booking
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_session_complete
  before update on public.message_session_complete
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_session_summary
  before update on public.message_session_summary
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_homework_submission
  before update on public.message_homework_submission
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_link_preview
  before update on public.message_link_preview
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_audio_recording
  before update on public.message_audio_recording
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_reactions
  before update on public.message_reactions
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_message_reaction_counts
  before update on public.message_reaction_counts
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_channel_media
  before update on public.channel_media
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_channel_files
  before update on public.channel_files
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_learning_spaces
  before update on public.learning_spaces
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_learning_space_channels
  before update on public.learning_space_channels
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_learning_space_participants
  before update on public.learning_space_participants
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_learning_space_links
  before update on public.learning_space_links
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_class_schedules
  before update on public.class_schedules
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_class_schedule_participants
  before update on public.class_schedule_participants
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_class_schedule_recurrence
  before update on public.class_schedule_recurrence
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_class_schedule_recurrence_exceptions
  before update on public.class_schedule_recurrence_exceptions
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_class_schedule_recurrence_overrides
  before update on public.class_schedule_recurrence_overrides
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_activity_feed_items
  before update on public.activity_feed_items
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at_activity_feed_group_members
  before update on public.activity_feed_group_members
  for each row execute procedure public.set_updated_at();

alter table public.threads
  add constraint threads_parent_message_id_fkey
  foreign key (parent_message_id)
  references public.messages(id);
