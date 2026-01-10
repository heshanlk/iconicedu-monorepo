-- Orgs

drop policy if exists "org members can read orgs" on public.orgs;

create policy "orgs read by member"
  on public.orgs
  for select
  using (deleted_at is null and public.is_org_member(id));

create policy "orgs manage by admin"
  on public.orgs
  for all
  using (deleted_at is null and public.is_org_admin(id))
  with check (deleted_at is null and public.is_org_admin(id));

-- Accounts

drop policy if exists "org members can read accounts" on public.accounts;
drop policy if exists "org members can write accounts" on public.accounts;

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

-- Roles

drop policy if exists "org members can read roles" on public.user_roles;
drop policy if exists "org members can write roles" on public.user_roles;

create policy "roles read by admin"
  on public.user_roles
  for select
  using (deleted_at is null and public.is_org_admin(org_id));

create policy "roles manage by admin"
  on public.user_roles
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

-- Profiles

drop policy if exists "org members can read profiles" on public.profiles;
drop policy if exists "org members can write profiles" on public.profiles;

create policy "profiles read by org"
  on public.profiles
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "profiles update self or admin"
  on public.profiles
  for update
  using (
    deleted_at is null
    and (
      public.is_profile_owner(id)
      or public.is_org_admin(org_id)
    )
  )
  with check (
    deleted_at is null
    and (
      public.is_profile_owner(id)
      or public.is_org_admin(org_id)
    )
  );

create policy "profiles insert admin"
  on public.profiles
  for insert
  with check (public.is_org_admin(org_id));

create policy "profiles delete admin"
  on public.profiles
  for delete
  using (public.is_org_admin(org_id));

-- Role-specific profile tables

drop policy if exists "org members can read educator profiles" on public.educator_profiles;
drop policy if exists "org members can write educator profiles" on public.educator_profiles;

drop policy if exists "org members can read child profiles" on public.child_profiles;
drop policy if exists "org members can write child profiles" on public.child_profiles;

drop policy if exists "org members can read guardian profiles" on public.guardian_profiles;
drop policy if exists "org members can write guardian profiles" on public.guardian_profiles;

drop policy if exists "org members can read staff profiles" on public.staff_profiles;
drop policy if exists "org members can write staff profiles" on public.staff_profiles;

create policy "educator profiles read by org"
  on public.educator_profiles
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "educator profiles manage by admin"
  on public.educator_profiles
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

create policy "child profiles read by org"
  on public.child_profiles
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "child profiles manage by admin"
  on public.child_profiles
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

create policy "guardian profiles read by org"
  on public.guardian_profiles
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "guardian profiles manage by admin"
  on public.guardian_profiles
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

create policy "staff profiles read by org"
  on public.staff_profiles
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "staff profiles manage by admin"
  on public.staff_profiles
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

-- Profile presence

drop policy if exists "org members can read profile presence" on public.profile_presence;
drop policy if exists "org members can write profile presence" on public.profile_presence;

create policy "profile presence read by org"
  on public.profile_presence
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "profile presence write self or admin"
  on public.profile_presence
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

-- Notification preferences

drop policy if exists "org members can read notification preferences" on public.notification_preferences;
drop policy if exists "org members can write notification preferences" on public.notification_preferences;

create policy "notification preferences self"
  on public.notification_preferences
  for all
  using (
    deleted_at is null
    and public.is_profile_owner(profile_id)
  )
  with check (
    deleted_at is null
    and public.is_profile_owner(profile_id)
  );

-- Educator subjects, grades, tags, badges

drop policy if exists "org members can read educator subjects" on public.educator_profile_subjects;
drop policy if exists "org members can write educator subjects" on public.educator_profile_subjects;

drop policy if exists "org members can read educator grade levels" on public.educator_profile_grade_levels;
drop policy if exists "org members can write educator grade levels" on public.educator_profile_grade_levels;

drop policy if exists "org members can read educator curriculum tags" on public.educator_profile_curriculum_tags;
drop policy if exists "org members can write educator curriculum tags" on public.educator_profile_curriculum_tags;

drop policy if exists "org members can read educator badges" on public.educator_profile_badges;
drop policy if exists "org members can write educator badges" on public.educator_profile_badges;

create policy "educator subjects read by org"
  on public.educator_profile_subjects
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "educator subjects manage by admin"
  on public.educator_profile_subjects
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

create policy "educator grade levels read by org"
  on public.educator_profile_grade_levels
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "educator grade levels manage by admin"
  on public.educator_profile_grade_levels
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

create policy "educator tags read by org"
  on public.educator_profile_curriculum_tags
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "educator tags manage by admin"
  on public.educator_profile_curriculum_tags
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

create policy "educator badges read by org"
  on public.educator_profile_badges
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "educator badges manage by admin"
  on public.educator_profile_badges
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

-- Child grade level

drop policy if exists "org members can read child grade level" on public.child_profile_grade_level;
drop policy if exists "org members can write child grade level" on public.child_profile_grade_level;

create policy "child grade read by org"
  on public.child_profile_grade_level
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "child grade manage by admin"
  on public.child_profile_grade_level
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

-- Staff specialties

drop policy if exists "org members can read staff specialties" on public.staff_profile_specialties;
drop policy if exists "org members can write staff specialties" on public.staff_profile_specialties;

create policy "staff specialties read by org"
  on public.staff_profile_specialties
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "staff specialties manage by admin"
  on public.staff_profile_specialties
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

-- Families

drop policy if exists "org members can read families" on public.families;
drop policy if exists "org members can write families" on public.families;

create policy "families read by org"
  on public.families
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "families manage by admin"
  on public.families
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

-- Family links

drop policy if exists "org members can read family links" on public.family_links;
drop policy if exists "org members can write family links" on public.family_links;

create policy "family links read by org"
  on public.family_links
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "family links manage by admin"
  on public.family_links
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));


-- Channels

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

-- Channel members

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

-- Channel capabilities

drop policy if exists "org members can read channel capabilities" on public.channel_capabilities;
drop policy if exists "org members can write channel capabilities" on public.channel_capabilities;

create policy "channel capabilities read by members"
  on public.channel_capabilities
  for select
  using (deleted_at is null and public.is_channel_member(channel_id));

create policy "channel capabilities manage"
  on public.channel_capabilities
  for all
  using (deleted_at is null and public.can_manage_channel(channel_id))
  with check (deleted_at is null and public.can_manage_channel(channel_id));

-- Read state

drop policy if exists "org members can read misc tables" on public.channel_read_state;
drop policy if exists "org members can write misc tables" on public.channel_read_state;

create policy "channel_read_state self"
  on public.channel_read_state
  for all
  using (deleted_at is null and account_id = public.current_account_id())
  with check (deleted_at is null and account_id = public.current_account_id());

-- Threads

drop policy if exists "org members can read threads" on public.threads;
drop policy if exists "org members can write threads" on public.threads;

create policy "threads read by channel membership"
  on public.threads
  for select
  using (deleted_at is null and public.is_channel_member(channel_id));

create policy "threads manage by channel members"
  on public.threads
  for all
  using (deleted_at is null and public.is_channel_member(channel_id))
  with check (deleted_at is null and public.is_channel_member(channel_id));

-- Thread participants

drop policy if exists "org members can read thread participants" on public.thread_participants;
drop policy if exists "org members can write thread participants" on public.thread_participants;

create policy "thread participants read by channel membership"
  on public.thread_participants
  for select
  using (
    deleted_at is null
    and exists (
      select 1
      from public.threads t
      where t.id = thread_id
        and t.deleted_at is null
        and public.is_channel_member(t.channel_id)
    )
  );

create policy "thread participants manage by channel members"
  on public.thread_participants
  for all
  using (
    deleted_at is null
    and exists (
      select 1
      from public.threads t
      where t.id = thread_id
        and t.deleted_at is null
        and public.is_channel_member(t.channel_id)
    )
  )
  with check (
    deleted_at is null
    and exists (
      select 1
      from public.threads t
      where t.id = thread_id
        and t.deleted_at is null
        and public.is_channel_member(t.channel_id)
    )
  );

-- Thread read state

drop policy if exists "org members can read thread read state" on public.thread_read_state;
drop policy if exists "org members can write thread read state" on public.thread_read_state;

create policy "thread_read_state self"
  on public.thread_read_state
  for all
  using (deleted_at is null and account_id = public.current_account_id())
  with check (deleted_at is null and account_id = public.current_account_id());

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

-- Payload tables

drop policy if exists "org members can read message payloads" on public.message_text;
drop policy if exists "org members can write message payloads" on public.message_text;

create policy "message_text read by message access"
  on public.message_text
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_text write by message access"
  on public.message_text
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_image read by message access"
  on public.message_image
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_image write by message access"
  on public.message_image
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_file read by message access"
  on public.message_file
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_file write by message access"
  on public.message_file
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_design_file_update read by message access"
  on public.message_design_file_update
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_design_file_update write by message access"
  on public.message_design_file_update
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_payment_reminder read by message access"
  on public.message_payment_reminder
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_payment_reminder write by message access"
  on public.message_payment_reminder
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_event_reminder read by message access"
  on public.message_event_reminder
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_event_reminder write by message access"
  on public.message_event_reminder
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_feedback_request read by message access"
  on public.message_feedback_request
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_feedback_request write by message access"
  on public.message_feedback_request
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_lesson_assignment read by message access"
  on public.message_lesson_assignment
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_lesson_assignment write by message access"
  on public.message_lesson_assignment
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_progress_update read by message access"
  on public.message_progress_update
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_progress_update write by message access"
  on public.message_progress_update
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_booking read by message access"
  on public.message_session_booking
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_booking write by message access"
  on public.message_session_booking
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_complete read by message access"
  on public.message_session_complete
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_complete write by message access"
  on public.message_session_complete
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_summary read by message access"
  on public.message_session_summary
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_session_summary write by message access"
  on public.message_session_summary
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_homework_submission read by message access"
  on public.message_homework_submission
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_homework_submission write by message access"
  on public.message_homework_submission
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_link_preview read by message access"
  on public.message_link_preview
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_link_preview write by message access"
  on public.message_link_preview
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "message_audio_recording read by message access"
  on public.message_audio_recording
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_audio_recording write by message access"
  on public.message_audio_recording
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

-- Reactions

drop policy if exists "org members can read reactions" on public.message_reactions;
drop policy if exists "org members can write reactions" on public.message_reactions;

drop policy if exists "org members can read reaction counts" on public.message_reaction_counts;
drop policy if exists "org members can write reaction counts" on public.message_reaction_counts;

create policy "message_reactions read by message access"
  on public.message_reactions
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "message_reactions write by message access"
  on public.message_reactions
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

create policy "reaction_counts read by message access"
  on public.message_reaction_counts
  for select
  using (deleted_at is null and public.can_access_message(message_id));

create policy "reaction_counts write by message access"
  on public.message_reaction_counts
  for all
  using (deleted_at is null and public.can_access_message(message_id))
  with check (deleted_at is null and public.can_access_message(message_id));

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

-- Learning spaces

drop policy if exists "org members can read learning spaces" on public.learning_spaces;
drop policy if exists "org members can write learning spaces" on public.learning_spaces;

create policy "learning spaces read by participant"
  on public.learning_spaces
  for select
  using (
    deleted_at is null
    and (
      public.is_learning_space_participant(id)
      or public.can_manage_learning_space(id)
    )
  );

create policy "learning spaces manage"
  on public.learning_spaces
  for all
  using (deleted_at is null and public.can_manage_learning_space(id))
  with check (deleted_at is null and public.can_manage_learning_space(id));

-- Learning space channels

drop policy if exists "org members can read learning space channels" on public.learning_space_channels;
drop policy if exists "org members can write learning space channels" on public.learning_space_channels;

create policy "learning space channels read by participant"
  on public.learning_space_channels
  for select
  using (
    deleted_at is null
    and (
      public.is_learning_space_participant(learning_space_id)
      or public.can_manage_learning_space(learning_space_id)
    )
  );

create policy "learning space channels manage"
  on public.learning_space_channels
  for all
  using (deleted_at is null and public.can_manage_learning_space(learning_space_id))
  with check (deleted_at is null and public.can_manage_learning_space(learning_space_id));

-- Learning space participants

drop policy if exists "org members can read learning space participants" on public.learning_space_participants;
drop policy if exists "org members can write learning space participants" on public.learning_space_participants;

create policy "learning space participants read by participant"
  on public.learning_space_participants
  for select
  using (
    deleted_at is null
    and (
      public.is_learning_space_participant(learning_space_id)
      or public.can_manage_learning_space(learning_space_id)
    )
  );

create policy "learning space participants manage"
  on public.learning_space_participants
  for all
  using (deleted_at is null and public.can_manage_learning_space(learning_space_id))
  with check (deleted_at is null and public.can_manage_learning_space(learning_space_id));

-- Learning space links

drop policy if exists "org members can read learning space links" on public.learning_space_links;
drop policy if exists "org members can write learning space links" on public.learning_space_links;

create policy "learning space links read by participant"
  on public.learning_space_links
  for select
  using (
    deleted_at is null
    and (
      public.is_learning_space_participant(learning_space_id)
      or public.can_manage_learning_space(learning_space_id)
    )
  );

create policy "learning space links manage"
  on public.learning_space_links
  for all
  using (deleted_at is null and public.can_manage_learning_space(learning_space_id))
  with check (deleted_at is null and public.can_manage_learning_space(learning_space_id));

-- Class schedules

drop policy if exists "org members can read schedules" on public.class_schedules;
drop policy if exists "org members can write schedules" on public.class_schedules;

create policy "class schedules read by participant"
  on public.class_schedules
  for select
  using (
    deleted_at is null
    and (
      public.is_schedule_participant(id)
      or public.can_manage_schedule(id)
    )
  );

create policy "class schedules manage"
  on public.class_schedules
  for all
  using (deleted_at is null and public.can_manage_schedule(id))
  with check (deleted_at is null and public.can_manage_schedule(id));

-- Class schedule participants

drop policy if exists "org members can read schedule participants" on public.class_schedule_participants;
drop policy if exists "org members can write schedule participants" on public.class_schedule_participants;

create policy "schedule participants read by participant"
  on public.class_schedule_participants
  for select
  using (
    deleted_at is null
    and (
      public.is_schedule_participant(schedule_id)
      or public.can_manage_schedule(schedule_id)
    )
  );

create policy "schedule participants manage"
  on public.class_schedule_participants
  for all
  using (deleted_at is null and public.can_manage_schedule(schedule_id))
  with check (deleted_at is null and public.can_manage_schedule(schedule_id));

-- Class schedule recurrence

drop policy if exists "org members can read schedule recurrence" on public.class_schedule_recurrence;
drop policy if exists "org members can write schedule recurrence" on public.class_schedule_recurrence;

create policy "schedule recurrence read by participant"
  on public.class_schedule_recurrence
  for select
  using (
    deleted_at is null
    and (
      public.is_schedule_participant(schedule_id)
      or public.can_manage_schedule(schedule_id)
    )
  );

create policy "schedule recurrence manage"
  on public.class_schedule_recurrence
  for all
  using (deleted_at is null and public.can_manage_schedule(schedule_id))
  with check (deleted_at is null and public.can_manage_schedule(schedule_id));

-- Recurrence exceptions

drop policy if exists "org members can read schedule exceptions" on public.class_schedule_recurrence_exceptions;
drop policy if exists "org members can write schedule exceptions" on public.class_schedule_recurrence_exceptions;

create policy "schedule exceptions read by participant"
  on public.class_schedule_recurrence_exceptions
  for select
  using (
    deleted_at is null
    and exists (
      select 1
      from public.class_schedule_recurrence cr
      where cr.id = recurrence_id
        and cr.deleted_at is null
        and (
          public.is_schedule_participant(cr.schedule_id)
          or public.can_manage_schedule(cr.schedule_id)
        )
    )
  );

create policy "schedule exceptions manage"
  on public.class_schedule_recurrence_exceptions
  for all
  using (
    deleted_at is null
    and exists (
      select 1
      from public.class_schedule_recurrence cr
      where cr.id = recurrence_id
        and cr.deleted_at is null
        and public.can_manage_schedule(cr.schedule_id)
    )
  )
  with check (
    deleted_at is null
    and exists (
      select 1
      from public.class_schedule_recurrence cr
      where cr.id = recurrence_id
        and cr.deleted_at is null
        and public.can_manage_schedule(cr.schedule_id)
    )
  );

-- Recurrence overrides

drop policy if exists "org members can read schedule overrides" on public.class_schedule_recurrence_overrides;
drop policy if exists "org members can write schedule overrides" on public.class_schedule_recurrence_overrides;

create policy "schedule overrides read by participant"
  on public.class_schedule_recurrence_overrides
  for select
  using (
    deleted_at is null
    and exists (
      select 1
      from public.class_schedule_recurrence cr
      where cr.id = recurrence_id
        and cr.deleted_at is null
        and (
          public.is_schedule_participant(cr.schedule_id)
          or public.can_manage_schedule(cr.schedule_id)
        )
    )
  );

create policy "schedule overrides manage"
  on public.class_schedule_recurrence_overrides
  for all
  using (
    deleted_at is null
    and exists (
      select 1
      from public.class_schedule_recurrence cr
      where cr.id = recurrence_id
        and cr.deleted_at is null
        and public.can_manage_schedule(cr.schedule_id)
    )
  )
  with check (
    deleted_at is null
    and exists (
      select 1
      from public.class_schedule_recurrence cr
      where cr.id = recurrence_id
        and cr.deleted_at is null
        and public.can_manage_schedule(cr.schedule_id)
    )
  );

-- Activity feed

drop policy if exists "org members can read activity feed" on public.activity_feed_items;
drop policy if exists "org members can write activity feed" on public.activity_feed_items;

create policy "activity feed read by org"
  on public.activity_feed_items
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "activity feed manage by admin"
  on public.activity_feed_items
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));

-- Activity feed group members

drop policy if exists "org members can read activity feed groups" on public.activity_feed_group_members;
drop policy if exists "org members can write activity feed groups" on public.activity_feed_group_members;

create policy "activity feed groups read by org"
  on public.activity_feed_group_members
  for select
  using (deleted_at is null and public.is_org_member(org_id));

create policy "activity feed groups manage by admin"
  on public.activity_feed_group_members
  for all
  using (deleted_at is null and public.is_org_admin(org_id))
  with check (deleted_at is null and public.is_org_admin(org_id));
