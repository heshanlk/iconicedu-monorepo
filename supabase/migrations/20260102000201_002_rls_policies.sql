-- Accounts: self or admin

drop policy if exists "org members can read accounts" on public.accounts;
drop policy if exists "org members can write accounts" on public.accounts;

drop policy if exists "accounts read self or admin" on public.accounts;
drop policy if exists "accounts update self or admin" on public.accounts;
drop policy if exists "accounts insert admin" on public.accounts;
drop policy if exists "accounts delete admin" on public.accounts;

create policy "accounts read self or admin"
  on public.accounts
  for select
  using (
    deleted_at is null
    and (
      id = public.current_account_id()
      or public.is_org_admin(org_id)
    )
  );

create policy "accounts update self or admin"
  on public.accounts
  for update
  using (
    deleted_at is null
    and (
      id = public.current_account_id()
      or public.is_org_admin(org_id)
    )
  )
  with check (
    deleted_at is null
    and (
      id = public.current_account_id()
      or public.is_org_admin(org_id)
    )
  );

create policy "accounts insert admin"
  on public.accounts
  for insert
  with check (public.is_org_admin(org_id));

create policy "accounts delete admin"
  on public.accounts
  for delete
  using (public.is_org_admin(org_id));

-- Channels: public visibility or membership

drop policy if exists "org members can read channels" on public.channels;

create policy "channels read by membership or public"
  on public.channels
  for select
  using (
    deleted_at is null
    and public.is_org_member(org_id)
    and (
      visibility = 'public'
      or public.is_channel_member(id)
    )
  );

create policy "channels manage"
  on public.channels
  for all
  using (deleted_at is null and public.can_manage_channel(id))
  with check (deleted_at is null and public.can_manage_channel(id));

-- Channel members: members can read their channel, managers can mutate

drop policy if exists "channel members can read channel members" on public.channel_members;
drop policy if exists "org members can write channel members" on public.channel_members;

create policy "channel members read members"
  on public.channel_members
  for select
  using (deleted_at is null and public.is_channel_member(channel_id));

create policy "channel members write members"
  on public.channel_members
  for all
  using (deleted_at is null and public.can_manage_channel(channel_id))
  with check (deleted_at is null and public.can_manage_channel(channel_id));

-- Messages

drop policy if exists "channel members can read messages" on public.messages;
drop policy if exists "channel members can write messages" on public.messages;

create policy "messages read channel members"
  on public.messages
  for select
  using (deleted_at is null and public.is_channel_member(channel_id));

create policy "messages insert channel members"
  on public.messages
  for insert
  with check (deleted_at is null and public.is_channel_member(channel_id));

create policy "messages update sender or manager"
  on public.messages
  for update
  using (deleted_at is null and public.can_mutate_message(id))
  with check (deleted_at is null and public.can_mutate_message(id));

create policy "messages delete sender or manager"
  on public.messages
  for delete
  using (deleted_at is null and public.can_mutate_message(id));

-- Message payload tables: use message access

drop policy if exists "org members can read message payloads" on public.message_text;
drop policy if exists "org members can write message payloads" on public.message_text;

create policy "message_text read by message access"
  on public.message_text
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_text insert by message access"
  on public.message_text
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_text update by message access"
  on public.message_text
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_text delete by message access"
  on public.message_text
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

-- Repeat for all payload tables
create policy "message_image read by message access"
  on public.message_image
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_image insert by message access"
  on public.message_image
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_image update by message access"
  on public.message_image
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_image delete by message access"
  on public.message_image
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_file read by message access"
  on public.message_file
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_file insert by message access"
  on public.message_file
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_file update by message access"
  on public.message_file
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_file delete by message access"
  on public.message_file
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_design_file_update read by message access"
  on public.message_design_file_update
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_design_file_update insert by message access"
  on public.message_design_file_update
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_design_file_update update by message access"
  on public.message_design_file_update
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_design_file_update delete by message access"
  on public.message_design_file_update
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_payment_reminder read by message access"
  on public.message_payment_reminder
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_payment_reminder insert by message access"
  on public.message_payment_reminder
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_payment_reminder update by message access"
  on public.message_payment_reminder
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_payment_reminder delete by message access"
  on public.message_payment_reminder
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_event_reminder read by message access"
  on public.message_event_reminder
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_event_reminder insert by message access"
  on public.message_event_reminder
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_event_reminder update by message access"
  on public.message_event_reminder
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_event_reminder delete by message access"
  on public.message_event_reminder
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_feedback_request read by message access"
  on public.message_feedback_request
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_feedback_request insert by message access"
  on public.message_feedback_request
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_feedback_request update by message access"
  on public.message_feedback_request
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_feedback_request delete by message access"
  on public.message_feedback_request
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_lesson_assignment read by message access"
  on public.message_lesson_assignment
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_lesson_assignment insert by message access"
  on public.message_lesson_assignment
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_lesson_assignment update by message access"
  on public.message_lesson_assignment
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_lesson_assignment delete by message access"
  on public.message_lesson_assignment
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_progress_update read by message access"
  on public.message_progress_update
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_progress_update insert by message access"
  on public.message_progress_update
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_progress_update update by message access"
  on public.message_progress_update
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_progress_update delete by message access"
  on public.message_progress_update
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_booking read by message access"
  on public.message_session_booking
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_booking insert by message access"
  on public.message_session_booking
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_booking update by message access"
  on public.message_session_booking
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_booking delete by message access"
  on public.message_session_booking
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_complete read by message access"
  on public.message_session_complete
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_complete insert by message access"
  on public.message_session_complete
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_complete update by message access"
  on public.message_session_complete
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_complete delete by message access"
  on public.message_session_complete
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_summary read by message access"
  on public.message_session_summary
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_summary insert by message access"
  on public.message_session_summary
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_summary update by message access"
  on public.message_session_summary
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_session_summary delete by message access"
  on public.message_session_summary
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_homework_submission read by message access"
  on public.message_homework_submission
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_homework_submission insert by message access"
  on public.message_homework_submission
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_homework_submission update by message access"
  on public.message_homework_submission
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_homework_submission delete by message access"
  on public.message_homework_submission
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_link_preview read by message access"
  on public.message_link_preview
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_link_preview insert by message access"
  on public.message_link_preview
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_link_preview update by message access"
  on public.message_link_preview
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_link_preview delete by message access"
  on public.message_link_preview
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_audio_recording read by message access"
  on public.message_audio_recording
  for select
  using (deleted_at is null and public.can_access_message(message_id));
create policy "message_audio_recording insert by message access"
  on public.message_audio_recording
  for insert
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_audio_recording update by message access"
  on public.message_audio_recording
  for update
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));
create policy "message_audio_recording delete by message access"
  on public.message_audio_recording
  for delete
  using (deleted_at is null and public.can_access_message(message_id));

-- Media and files

drop policy if exists "org members can read channel media" on public.channel_media;
drop policy if exists "org members can write channel media" on public.channel_media;

drop policy if exists "org members can read channel files" on public.channel_files;
drop policy if exists "org members can write channel files" on public.channel_files;

create policy "channel_media read by channel membership"
  on public.channel_media
  for select
  using (deleted_at is null and public.is_channel_member(channel_id));

create policy "channel_media write by channel membership"
  on public.channel_media
  for all
  using (deleted_at is null and public.is_channel_member(channel_id))
  with check (deleted_at is null and public.is_channel_member(channel_id));

create policy "channel_files read by channel membership"
  on public.channel_files
  for select
  using (deleted_at is null and public.is_channel_member(channel_id));

create policy "channel_files write by channel membership"
  on public.channel_files
  for all
  using (deleted_at is null and public.is_channel_member(channel_id))
  with check (deleted_at is null and public.is_channel_member(channel_id));

-- Read state tables: self only

drop policy if exists "org members can read misc tables" on public.channel_read_state;
drop policy if exists "org members can write misc tables" on public.channel_read_state;

create policy "channel_read_state self"
  on public.channel_read_state
  for all
  using (deleted_at is null and account_id = public.current_account_id())
  with check (deleted_at is null and account_id = public.current_account_id());

create policy "thread_read_state self"
  on public.thread_read_state
  for all
  using (deleted_at is null and account_id = public.current_account_id())
  with check (deleted_at is null and account_id = public.current_account_id());

-- Notification preferences: self only

drop policy if exists "org members can read notification preferences" on public.notification_preferences;
drop policy if exists "org members can write notification preferences" on public.notification_preferences;

create policy "notification preferences self"
  on public.notification_preferences
  for all
  using (
    deleted_at is null
    and profile_id in (
      select p.id
      from public.profiles p
      join public.accounts a on a.id = p.account_id
      where a.auth_user_id = auth.uid()
        and a.deleted_at is null
        and p.deleted_at is null
    )
  )
  with check (
    deleted_at is null
    and profile_id in (
      select p.id
      from public.profiles p
      join public.accounts a on a.id = p.account_id
      where a.auth_user_id = auth.uid()
        and a.deleted_at is null
        and p.deleted_at is null
    )
  );
