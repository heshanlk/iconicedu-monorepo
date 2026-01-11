import type { AccountStatus, FamilyRelation, ISODateTime, UUID } from '../shared/shared';
import type { GradeLevel } from '../grades';

export type ProfileKindRow = 'educator' | 'guardian' | 'child' | 'staff' | 'system';

export interface ProfileRow {
  id: UUID;
  org_id: UUID;
  account_id: UUID;
  kind: ProfileKindRow;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  bio?: string | null;
  avatar_source: string;
  avatar_url?: string | null;
  avatar_seed?: string | null;
  avatar_updated_at?: ISODateTime | null;
  timezone?: string | null;
  locale?: string | null;
  languages_spoken?: string[] | null;
  status?: AccountStatus | null;
  country_code?: string | null;
  country_name?: string | null;
  region?: string | null;
  city?: string | null;
  postal_code?: string | null;
  notes_internal?: string | null;
  lead_source?: string | null;
  ui_theme_key?: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
  deleted_at?: ISODateTime | null;
}

export interface EducatorProfileRow {
  profile_id: UUID;
  org_id: UUID;
  headline?: string | null;
  education?: string | null;
  experience_years?: number | null;
  certifications?: unknown[] | null;
  joined_date?: ISODateTime | null;
  age_groups_comfortable_with?: string[] | null;
  identity_verification_status?: string | null;
  average_rating?: number | null;
  total_reviews?: number | null;
  featured_video_intro_url?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface ChildProfileRow {
  profile_id: UUID;
  org_id: UUID;
  birth_year?: number | null;
  school_name?: string | null;
  school_year?: string | null;
  confidence_level?: string | null;
  communication_style?: string | null;
  interests?: string[] | null;
  strengths?: string[] | null;
  learning_preferences?: string[] | null;
  motivation_styles?: string[] | null;
  communication_styles?: string[] | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface GuardianProfileRow {
  profile_id: UUID;
  org_id: UUID;
  joined_date?: ISODateTime | null;
  session_notes_visibility?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface StaffProfileRow {
  profile_id: UUID;
  org_id: UUID;
  department?: string | null;
  manager_staff_id?: UUID | null;
  job_title?: string | null;
  permissions_scope?: string | null;
  working_hours_rules?: string[] | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface EducatorProfileSubjectRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  subject: string;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface EducatorProfileGradeLevelRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  grade_id: GradeLevel;
  grade_label?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface ChildProfileGradeLevelRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  grade_id: GradeLevel;
  grade_label?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface EducatorProfileCurriculumTagRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  tag: string;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface EducatorProfileBadgeRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  badge: string;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface StaffProfileSpecialtyRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  specialty: string;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface ProfilePresenceRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  state_text?: string | null;
  state_emoji?: string | null;
  state_expires_at?: ISODateTime | null;
  live_status?: string | null;
  display_status?: string | null;
  last_seen_at?: ISODateTime | null;
  presence_loaded?: boolean | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface NotificationPreferenceRow {
  id: UUID;
  org_id: UUID;
  profile_id: UUID;
  pref_key: string;
  channels: string[];
  muted?: boolean | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}

export interface FamilyLinkRow {
  id: UUID;
  org_id: UUID;
  family_id: UUID;
  guardian_account_id: UUID;
  child_account_id: UUID;
  relation: FamilyRelation;
  permissions_scope?: string[] | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}
