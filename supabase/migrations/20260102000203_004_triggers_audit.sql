create or replace function public.set_created_by()
returns trigger
language plpgsql
as $$
begin
  if new.created_by is null then
    new.created_by = public.current_account_id();
  end if;
  return new;
end;
$$;

create or replace function public.set_updated_by()
returns trigger
language plpgsql
as $$
begin
  new.updated_by = public.current_account_id();
  new.updated_at = now();
  return new;
end;
$$;

-- Drop existing triggers if present

do $$
begin
  perform 1;
  execute 'drop trigger if exists set_created_by_accounts on public.accounts';
  execute 'drop trigger if exists set_updated_by_accounts on public.accounts';
  execute 'drop trigger if exists set_created_by_user_roles on public.user_roles';
  execute 'drop trigger if exists set_updated_by_user_roles on public.user_roles';
  execute 'drop trigger if exists set_created_by_profiles on public.profiles';
  execute 'drop trigger if exists set_updated_by_profiles on public.profiles';
  execute 'drop trigger if exists set_created_by_educator_profiles on public.educator_profiles';
  execute 'drop trigger if exists set_updated_by_educator_profiles on public.educator_profiles';
  execute 'drop trigger if exists set_created_by_child_profiles on public.child_profiles';
  execute 'drop trigger if exists set_updated_by_child_profiles on public.child_profiles';
  execute 'drop trigger if exists set_created_by_guardian_profiles on public.guardian_profiles';
  execute 'drop trigger if exists set_updated_by_guardian_profiles on public.guardian_profiles';
  execute 'drop trigger if exists set_created_by_staff_profiles on public.staff_profiles';
  execute 'drop trigger if exists set_updated_by_staff_profiles on public.staff_profiles';
  execute 'drop trigger if exists set_created_by_profile_presence on public.profile_presence';
  execute 'drop trigger if exists set_updated_by_profile_presence on public.profile_presence';
  execute 'drop trigger if exists set_created_by_notification_preferences on public.notification_preferences';
  execute 'drop trigger if exists set_updated_by_notification_preferences on public.notification_preferences';
  execute 'drop trigger if exists set_created_by_educator_profile_subjects on public.educator_profile_subjects';
  execute 'drop trigger if exists set_updated_by_educator_profile_subjects on public.educator_profile_subjects';
  execute 'drop trigger if exists set_created_by_educator_profile_grade_levels on public.educator_profile_grade_levels';
  execute 'drop trigger if exists set_updated_by_educator_profile_grade_levels on public.educator_profile_grade_levels';
  execute 'drop trigger if exists set_created_by_child_profile_grade_level on public.child_profile_grade_level';
  execute 'drop trigger if exists set_updated_by_child_profile_grade_level on public.child_profile_grade_level';
  execute 'drop trigger if exists set_created_by_educator_profile_curriculum_tags on public.educator_profile_curriculum_tags';
  execute 'drop trigger if exists set_updated_by_educator_profile_curriculum_tags on public.educator_profile_curriculum_tags';
  execute 'drop trigger if exists set_created_by_educator_profile_badges on public.educator_profile_badges';
  execute 'drop trigger if exists set_updated_by_educator_profile_badges on public.educator_profile_badges';
  execute 'drop trigger if exists set_created_by_staff_profile_specialties on public.staff_profile_specialties';
  execute 'drop trigger if exists set_updated_by_staff_profile_specialties on public.staff_profile_specialties';
  execute 'drop trigger if exists set_created_by_families on public.families';
  execute 'drop trigger if exists set_updated_by_families on public.families';
  execute 'drop trigger if exists set_created_by_family_links on public.family_links';
  execute 'drop trigger if exists set_updated_by_family_links on public.family_links';
  execute 'drop trigger if exists set_created_by_channels on public.channels';
  execute 'drop trigger if exists set_updated_by_channels on public.channels';
  execute 'drop trigger if exists set_created_by_channel_members on public.channel_members';
  execute 'drop trigger if exists set_updated_by_channel_members on public.channel_members';
  execute 'drop trigger if exists set_created_by_channel_capabilities on public.channel_capabilities';
  execute 'drop trigger if exists set_updated_by_channel_capabilities on public.channel_capabilities';
  execute 'drop trigger if exists set_created_by_channel_read_state on public.channel_read_state';
  execute 'drop trigger if exists set_updated_by_channel_read_state on public.channel_read_state';
  execute 'drop trigger if exists set_created_by_threads on public.threads';
  execute 'drop trigger if exists set_updated_by_threads on public.threads';
  execute 'drop trigger if exists set_created_by_thread_participants on public.thread_participants';
  execute 'drop trigger if exists set_updated_by_thread_participants on public.thread_participants';
  execute 'drop trigger if exists set_created_by_thread_read_state on public.thread_read_state';
  execute 'drop trigger if exists set_updated_by_thread_read_state on public.thread_read_state';
  execute 'drop trigger if exists set_created_by_messages on public.messages';
  execute 'drop trigger if exists set_updated_by_messages on public.messages';
  execute 'drop trigger if exists set_created_by_message_text on public.message_text';
  execute 'drop trigger if exists set_updated_by_message_text on public.message_text';
  execute 'drop trigger if exists set_created_by_message_image on public.message_image';
  execute 'drop trigger if exists set_updated_by_message_image on public.message_image';
  execute 'drop trigger if exists set_created_by_message_file on public.message_file';
  execute 'drop trigger if exists set_updated_by_message_file on public.message_file';
  execute 'drop trigger if exists set_created_by_message_design_file_update on public.message_design_file_update';
  execute 'drop trigger if exists set_updated_by_message_design_file_update on public.message_design_file_update';
  execute 'drop trigger if exists set_created_by_message_payment_reminder on public.message_payment_reminder';
  execute 'drop trigger if exists set_updated_by_message_payment_reminder on public.message_payment_reminder';
  execute 'drop trigger if exists set_created_by_message_event_reminder on public.message_event_reminder';
  execute 'drop trigger if exists set_updated_by_message_event_reminder on public.message_event_reminder';
  execute 'drop trigger if exists set_created_by_message_feedback_request on public.message_feedback_request';
  execute 'drop trigger if exists set_updated_by_message_feedback_request on public.message_feedback_request';
  execute 'drop trigger if exists set_created_by_message_lesson_assignment on public.message_lesson_assignment';
  execute 'drop trigger if exists set_updated_by_message_lesson_assignment on public.message_lesson_assignment';
  execute 'drop trigger if exists set_created_by_message_progress_update on public.message_progress_update';
  execute 'drop trigger if exists set_updated_by_message_progress_update on public.message_progress_update';
  execute 'drop trigger if exists set_created_by_message_session_booking on public.message_session_booking';
  execute 'drop trigger if exists set_updated_by_message_session_booking on public.message_session_booking';
  execute 'drop trigger if exists set_created_by_message_session_complete on public.message_session_complete';
  execute 'drop trigger if exists set_updated_by_message_session_complete on public.message_session_complete';
  execute 'drop trigger if exists set_created_by_message_session_summary on public.message_session_summary';
  execute 'drop trigger if exists set_updated_by_message_session_summary on public.message_session_summary';
  execute 'drop trigger if exists set_created_by_message_homework_submission on public.message_homework_submission';
  execute 'drop trigger if exists set_updated_by_message_homework_submission on public.message_homework_submission';
  execute 'drop trigger if exists set_created_by_message_link_preview on public.message_link_preview';
  execute 'drop trigger if exists set_updated_by_message_link_preview on public.message_link_preview';
  execute 'drop trigger if exists set_created_by_message_audio_recording on public.message_audio_recording';
  execute 'drop trigger if exists set_updated_by_message_audio_recording on public.message_audio_recording';
  execute 'drop trigger if exists set_created_by_message_reactions on public.message_reactions';
  execute 'drop trigger if exists set_updated_by_message_reactions on public.message_reactions';
  execute 'drop trigger if exists set_created_by_message_reaction_counts on public.message_reaction_counts';
  execute 'drop trigger if exists set_updated_by_message_reaction_counts on public.message_reaction_counts';
  execute 'drop trigger if exists set_created_by_channel_media on public.channel_media';
  execute 'drop trigger if exists set_updated_by_channel_media on public.channel_media';
  execute 'drop trigger if exists set_created_by_channel_files on public.channel_files';
  execute 'drop trigger if exists set_updated_by_channel_files on public.channel_files';
  execute 'drop trigger if exists set_created_by_learning_spaces on public.learning_spaces';
  execute 'drop trigger if exists set_updated_by_learning_spaces on public.learning_spaces';
  execute 'drop trigger if exists set_created_by_learning_space_channels on public.learning_space_channels';
  execute 'drop trigger if exists set_updated_by_learning_space_channels on public.learning_space_channels';
  execute 'drop trigger if exists set_created_by_learning_space_participants on public.learning_space_participants';
  execute 'drop trigger if exists set_updated_by_learning_space_participants on public.learning_space_participants';
  execute 'drop trigger if exists set_created_by_learning_space_links on public.learning_space_links';
  execute 'drop trigger if exists set_updated_by_learning_space_links on public.learning_space_links';
  execute 'drop trigger if exists set_created_by_class_schedules on public.class_schedules';
  execute 'drop trigger if exists set_updated_by_class_schedules on public.class_schedules';
  execute 'drop trigger if exists set_created_by_class_schedule_participants on public.class_schedule_participants';
  execute 'drop trigger if exists set_updated_by_class_schedule_participants on public.class_schedule_participants';
  execute 'drop trigger if exists set_created_by_class_schedule_recurrence on public.class_schedule_recurrence';
  execute 'drop trigger if exists set_updated_by_class_schedule_recurrence on public.class_schedule_recurrence';
  execute 'drop trigger if exists set_created_by_class_schedule_recurrence_exceptions on public.class_schedule_recurrence_exceptions';
  execute 'drop trigger if exists set_updated_by_class_schedule_recurrence_exceptions on public.class_schedule_recurrence_exceptions';
  execute 'drop trigger if exists set_created_by_class_schedule_recurrence_overrides on public.class_schedule_recurrence_overrides';
  execute 'drop trigger if exists set_updated_by_class_schedule_recurrence_overrides on public.class_schedule_recurrence_overrides';
  execute 'drop trigger if exists set_created_by_activity_feed_items on public.activity_feed_items';
  execute 'drop trigger if exists set_updated_by_activity_feed_items on public.activity_feed_items';
  execute 'drop trigger if exists set_created_by_activity_feed_group_members on public.activity_feed_group_members';
  execute 'drop trigger if exists set_updated_by_activity_feed_group_members on public.activity_feed_group_members';
end;
$$;

-- Create triggers
create trigger set_created_by_accounts
  before insert on public.accounts
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_accounts
  before update on public.accounts
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_user_roles
  before insert on public.user_roles
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_user_roles
  before update on public.user_roles
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_profiles
  before insert on public.profiles
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_profiles
  before update on public.profiles
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_educator_profiles
  before insert on public.educator_profiles
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_educator_profiles
  before update on public.educator_profiles
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_child_profiles
  before insert on public.child_profiles
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_child_profiles
  before update on public.child_profiles
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_guardian_profiles
  before insert on public.guardian_profiles
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_guardian_profiles
  before update on public.guardian_profiles
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_staff_profiles
  before insert on public.staff_profiles
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_staff_profiles
  before update on public.staff_profiles
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_profile_presence
  before insert on public.profile_presence
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_profile_presence
  before update on public.profile_presence
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_notification_preferences
  before insert on public.notification_preferences
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_notification_preferences
  before update on public.notification_preferences
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_educator_profile_subjects
  before insert on public.educator_profile_subjects
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_educator_profile_subjects
  before update on public.educator_profile_subjects
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_educator_profile_grade_levels
  before insert on public.educator_profile_grade_levels
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_educator_profile_grade_levels
  before update on public.educator_profile_grade_levels
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_child_profile_grade_level
  before insert on public.child_profile_grade_level
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_child_profile_grade_level
  before update on public.child_profile_grade_level
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_educator_profile_curriculum_tags
  before insert on public.educator_profile_curriculum_tags
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_educator_profile_curriculum_tags
  before update on public.educator_profile_curriculum_tags
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_educator_profile_badges
  before insert on public.educator_profile_badges
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_educator_profile_badges
  before update on public.educator_profile_badges
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_staff_profile_specialties
  before insert on public.staff_profile_specialties
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_staff_profile_specialties
  before update on public.staff_profile_specialties
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_families
  before insert on public.families
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_families
  before update on public.families
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_family_links
  before insert on public.family_links
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_family_links
  before update on public.family_links
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_channels
  before insert on public.channels
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_channels
  before update on public.channels
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_channel_members
  before insert on public.channel_members
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_channel_members
  before update on public.channel_members
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_channel_capabilities
  before insert on public.channel_capabilities
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_channel_capabilities
  before update on public.channel_capabilities
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_channel_read_state
  before insert on public.channel_read_state
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_channel_read_state
  before update on public.channel_read_state
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_threads
  before insert on public.threads
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_threads
  before update on public.threads
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_thread_participants
  before insert on public.thread_participants
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_thread_participants
  before update on public.thread_participants
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_thread_read_state
  before insert on public.thread_read_state
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_thread_read_state
  before update on public.thread_read_state
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_messages
  before insert on public.messages
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_messages
  before update on public.messages
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_text
  before insert on public.message_text
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_text
  before update on public.message_text
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_image
  before insert on public.message_image
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_image
  before update on public.message_image
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_file
  before insert on public.message_file
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_file
  before update on public.message_file
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_design_file_update
  before insert on public.message_design_file_update
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_design_file_update
  before update on public.message_design_file_update
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_payment_reminder
  before insert on public.message_payment_reminder
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_payment_reminder
  before update on public.message_payment_reminder
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_event_reminder
  before insert on public.message_event_reminder
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_event_reminder
  before update on public.message_event_reminder
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_feedback_request
  before insert on public.message_feedback_request
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_feedback_request
  before update on public.message_feedback_request
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_lesson_assignment
  before insert on public.message_lesson_assignment
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_lesson_assignment
  before update on public.message_lesson_assignment
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_progress_update
  before insert on public.message_progress_update
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_progress_update
  before update on public.message_progress_update
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_session_booking
  before insert on public.message_session_booking
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_session_booking
  before update on public.message_session_booking
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_session_complete
  before insert on public.message_session_complete
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_session_complete
  before update on public.message_session_complete
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_session_summary
  before insert on public.message_session_summary
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_session_summary
  before update on public.message_session_summary
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_homework_submission
  before insert on public.message_homework_submission
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_homework_submission
  before update on public.message_homework_submission
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_link_preview
  before insert on public.message_link_preview
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_link_preview
  before update on public.message_link_preview
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_audio_recording
  before insert on public.message_audio_recording
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_audio_recording
  before update on public.message_audio_recording
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_reactions
  before insert on public.message_reactions
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_reactions
  before update on public.message_reactions
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_message_reaction_counts
  before insert on public.message_reaction_counts
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_message_reaction_counts
  before update on public.message_reaction_counts
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_channel_media
  before insert on public.channel_media
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_channel_media
  before update on public.channel_media
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_channel_files
  before insert on public.channel_files
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_channel_files
  before update on public.channel_files
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_learning_spaces
  before insert on public.learning_spaces
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_learning_spaces
  before update on public.learning_spaces
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_learning_space_channels
  before insert on public.learning_space_channels
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_learning_space_channels
  before update on public.learning_space_channels
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_learning_space_participants
  before insert on public.learning_space_participants
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_learning_space_participants
  before update on public.learning_space_participants
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_learning_space_links
  before insert on public.learning_space_links
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_learning_space_links
  before update on public.learning_space_links
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_class_schedules
  before insert on public.class_schedules
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_class_schedules
  before update on public.class_schedules
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_class_schedule_participants
  before insert on public.class_schedule_participants
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_class_schedule_participants
  before update on public.class_schedule_participants
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_class_schedule_recurrence
  before insert on public.class_schedule_recurrence
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_class_schedule_recurrence
  before update on public.class_schedule_recurrence
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_class_schedule_recurrence_exceptions
  before insert on public.class_schedule_recurrence_exceptions
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_class_schedule_recurrence_exceptions
  before update on public.class_schedule_recurrence_exceptions
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_class_schedule_recurrence_overrides
  before insert on public.class_schedule_recurrence_overrides
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_class_schedule_recurrence_overrides
  before update on public.class_schedule_recurrence_overrides
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_activity_feed_items
  before insert on public.activity_feed_items
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_activity_feed_items
  before update on public.activity_feed_items
  for each row execute procedure public.set_updated_by();

create trigger set_created_by_activity_feed_group_members
  before insert on public.activity_feed_group_members
  for each row execute procedure public.set_created_by();
create trigger set_updated_by_activity_feed_group_members
  before update on public.activity_feed_group_members
  for each row execute procedure public.set_updated_by();
