export const ACCOUNT_SELECT = [
  'id',
  'org_id',
  'auth_user_id',
  'email',
  'phone_e164',
  'whatsapp_e164',
  'email_verified',
  'email_verified_at',
  'phone_verified',
  'phone_verified_at',
  'whatsapp_verified',
  'whatsapp_verified_at',
  'preferred_contact_channels',
  'status',
  'created_at',
  'updated_at',
  'archived_at',
].join(',');

export const ROLE_SELECT = 'id, org_id, role_key, assigned_by, assigned_at';

export const PROFILE_SELECT = [
  'id',
  'org_id',
  'account_id',
  'kind',
  'display_name',
  'first_name',
  'last_name',
  'bio',
  'avatar_source',
  'avatar_url',
  'avatar_seed',
  'avatar_updated_at',
  'timezone',
  'locale',
  'languages_spoken',
  'status',
  'country_code',
  'country_name',
  'region',
  'city',
  'postal_code',
  'notes_internal',
  'lead_source',
  'ui_theme_key',
  'created_at',
  'updated_at',
].join(',');

export const NOTIFICATION_DEFAULTS_SELECT = 'pref_key, channels, muted';

export const PRESENCE_SELECT = [
  'state_text',
  'state_emoji',
  'state_expires_at',
  'live_status',
  'display_status',
  'last_seen_at',
  'presence_loaded',
].join(',');

export const EDUCATOR_PROFILE_SELECT = [
  'headline',
  'education',
  'experience_years',
  'certifications',
  'joined_date',
  'age_groups_comfortable_with',
  'identity_verification_status',
  'average_rating',
  'total_reviews',
  'featured_video_intro_url',
].join(',');

export const EDUCATOR_SUBJECTS_SELECT = 'subject';
export const EDUCATOR_GRADE_LEVELS_SELECT = 'grade_id, grade_label';
export const EDUCATOR_CURRICULUM_TAGS_SELECT = 'tag';
export const EDUCATOR_BADGES_SELECT = 'badge';
export const EDUCATOR_AVAILABILITY_SELECT =
  'profile_id, org_id, class_types, weekly_commitment, availability, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by';

export const CHILD_PROFILE_SELECT = [
  'birth_year',
  'school_name',
  'school_year',
  'confidence_level',
  'communication_style',
  'interests',
  'strengths',
  'learning_preferences',
  'motivation_styles',
  'communication_styles',
].join(',');
export const CHILD_GRADE_LEVEL_SELECT = 'grade_id, grade_label';

export const STAFF_PROFILE_SELECT =
  'department, manager_staff_id, job_title, permissions_scope, weekly_availability';
export const STAFF_SPECIALTIES_SELECT = 'specialty';

export const GUARDIAN_PROFILE_SELECT = 'joined_date, session_notes_visibility';
export const FAMILY_LINKS_SELECT = 'child_account_id';

export const CHILD_PROFILES_SELECT = PROFILE_SELECT;
export const CHILD_PROFILE_ROWS_SELECT = [
  'profile_id',
  'birth_year',
  'school_name',
  'school_year',
  'confidence_level',
  'communication_style',
  'interests',
  'strengths',
  'learning_preferences',
  'motivation_styles',
  'communication_styles',
].join(',');
export const CHILD_GRADE_LEVEL_ROWS_SELECT =
  'profile_id, grade_id, grade_label';
