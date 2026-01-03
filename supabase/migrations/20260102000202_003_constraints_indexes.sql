-- Remove global unique on auth_user_id and add per-org unique
alter table public.accounts drop constraint if exists accounts_auth_user_id_key;
create unique index if not exists accounts_org_auth_user_id_key
  on public.accounts (org_id, auth_user_id)
  where deleted_at is null;

-- dm_key constraints
alter table public.channels
  add constraint channels_dm_key_required
  check (
    (kind in ('dm', 'group_dm') and dm_key is not null)
    or (kind = 'channel' and dm_key is null)
  );

create unique index if not exists channels_org_dm_key_uniq
  on public.channels (org_id, dm_key)
  where dm_key is not null and deleted_at is null;

-- Message visibility constraints
alter table public.messages
  add constraint messages_visibility_check
  check (
    (visibility_type = 'all' and visibility_user_id is null and (visibility_user_ids is null or array_length(visibility_user_ids,1) is null))
    or (visibility_type = 'sender-only' and visibility_user_id is null and (visibility_user_ids is null or array_length(visibility_user_ids,1) is null))
    or (visibility_type = 'recipient-only' and visibility_user_id is not null and (visibility_user_ids is null or array_length(visibility_user_ids,1) is null))
    or (visibility_type = 'specific-users' and visibility_user_id is null and array_length(visibility_user_ids,1) > 0)
  );

create index if not exists messages_org_channel_created_idx
  on public.messages (org_id, channel_id, created_at desc);

create index if not exists messages_org_thread_created_idx
  on public.messages (org_id, thread_id, created_at desc);

create index if not exists message_visibility_user_ids_gin
  on public.messages using gin (visibility_user_ids);

create index if not exists channel_media_channel_created_idx
  on public.channel_media (channel_id, created_at desc);

create index if not exists channel_files_channel_created_idx
  on public.channel_files (channel_id, created_at desc);

create index if not exists channel_members_org_profile_idx
  on public.channel_members (org_id, profile_id);

create index if not exists learning_space_participants_org_profile_idx
  on public.learning_space_participants (org_id, profile_id);

create index if not exists class_schedule_participants_org_profile_idx
  on public.class_schedule_participants (org_id, profile_id);

create index if not exists activity_feed_items_tab_idx
  on public.activity_feed_items (org_id, tab_key, occurred_at desc);

create index if not exists accounts_org_status_idx
  on public.accounts (org_id, status)
  where deleted_at is null;

create index if not exists profiles_org_kind_idx
  on public.profiles (org_id, kind)
  where deleted_at is null;

create index if not exists channels_org_kind_idx
  on public.channels (org_id, kind)
  where deleted_at is null;
