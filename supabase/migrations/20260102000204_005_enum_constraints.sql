-- Enums for constrained text columns

do $$
begin
  if not exists (select 1 from pg_type where typname = 'avatar_source') then
    create type public.avatar_source as enum ('seed', 'upload', 'external');
  end if;
  if not exists (select 1 from pg_type where typname = 'identity_verification_status') then
    create type public.identity_verification_status as enum ('unverified', 'pending', 'verified');
  end if;
  if not exists (select 1 from pg_type where typname = 'session_notes_visibility') then
    create type public.session_notes_visibility as enum ('private', 'shared');
  end if;
  if not exists (select 1 from pg_type where typname = 'staff_permissions_scope') then
    create type public.staff_permissions_scope as enum ('limited', 'standard', 'elevated');
  end if;
  if not exists (select 1 from pg_type where typname = 'channel_capability') then
    create type public.channel_capability as enum ('has_schedule', 'has_homework', 'has_summaries');
  end if;
  if not exists (select 1 from pg_type where typname = 'contact_channel') then
    create type public.contact_channel as enum ('email', 'sms', 'whatsapp');
  end if;
  if not exists (select 1 from pg_type where typname = 'notification_channel') then
    create type public.notification_channel as enum ('push', 'email', 'sms', 'whatsapp');
  end if;
  if not exists (select 1 from pg_type where typname = 'presence_display_status') then
    create type public.presence_display_status as enum ('online', 'idle', 'busy', 'away', 'offline');
  end if;
  if not exists (select 1 from pg_type where typname = 'live_status') then
    create type public.live_status as enum ('in_class', 'teaching', 'reviewing_work', 'busy', 'away', 'offline');
  end if;
  if not exists (select 1 from pg_type where typname = 'class_schedule_source_kind') then
    create type public.class_schedule_source_kind as enum ('class_session', 'availability_block', 'manual');
  end if;
end $$;

-- Apply enum types
alter table public.profiles
  alter column avatar_source type public.avatar_source
  using avatar_source::public.avatar_source;

alter table public.educator_profiles
  alter column identity_verification_status type public.identity_verification_status
  using identity_verification_status::public.identity_verification_status;

alter table public.guardian_profiles
  alter column session_notes_visibility type public.session_notes_visibility
  using session_notes_visibility::public.session_notes_visibility;

alter table public.staff_profiles
  alter column permissions_scope type public.staff_permissions_scope
  using permissions_scope::public.staff_permissions_scope;

alter table public.channel_capabilities
  alter column capability type public.channel_capability
  using capability::public.channel_capability;

alter table public.accounts
  alter column preferred_contact_channels type public.contact_channel[]
  using preferred_contact_channels::public.contact_channel[];

alter table public.notification_preferences
  alter column channels type public.notification_channel[]
  using channels::public.notification_channel[];

alter table public.profile_presence
  alter column display_status type public.presence_display_status
  using display_status::public.presence_display_status;

alter table public.profile_presence
  alter column live_status type public.live_status
  using live_status::public.live_status;

alter table public.class_schedules
  alter column source_kind type public.class_schedule_source_kind
  using source_kind::public.class_schedule_source_kind;

-- Theme key constraints
alter table public.profiles
  drop constraint if exists profiles_ui_theme_key_check;
alter table public.profiles
  add constraint profiles_ui_theme_key_check
  check (
    ui_theme_key is null
    or ui_theme_key in (
      'slate','gray','zinc','neutral','stone','amber','blue','cyan','emerald','fuchsia',
      'green','indigo','lime','orange','pink','purple','red','rose','sky','teal','violet','yellow'
    )
  );

alter table public.class_schedules
  drop constraint if exists class_schedules_theme_key_check;
alter table public.class_schedules
  add constraint class_schedules_theme_key_check
  check (
    theme_key is null
    or theme_key in (
      'slate','gray','zinc','neutral','stone','amber','blue','cyan','emerald','fuchsia',
      'green','indigo','lime','orange','pink','purple','red','rose','sky','teal','violet','yellow'
    )
  );

alter table public.class_schedule_participants
  drop constraint if exists class_schedule_participants_theme_key_check;
alter table public.class_schedule_participants
  add constraint class_schedule_participants_theme_key_check
  check (
    theme_key is null
    or theme_key in (
      'slate','gray','zinc','neutral','stone','amber','blue','cyan','emerald','fuchsia',
      'green','indigo','lime','orange','pink','purple','red','rose','sky','teal','violet','yellow'
    )
  );
