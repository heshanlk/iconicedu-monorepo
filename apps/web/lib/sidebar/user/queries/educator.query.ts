import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  EducatorProfileBadgeRow,
  EducatorProfileCurriculumTagRow,
  EducatorProfileGradeLevelRow,
  EducatorProfileRow,
  EducatorProfileSubjectRow,
} from '@iconicedu/shared-types';

import {
  EDUCATOR_BADGES_SELECT,
  EDUCATOR_CURRICULUM_TAGS_SELECT,
  EDUCATOR_GRADE_LEVELS_SELECT,
  EDUCATOR_PROFILE_SELECT,
  EDUCATOR_SUBJECTS_SELECT,
} from '../constants/selects';

export async function getEducatorProfile(
  supabase: SupabaseClient,
  profileId: string,
) {
  return supabase
    .from('educator_profiles')
    .select(EDUCATOR_PROFILE_SELECT)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .maybeSingle<EducatorProfileRow>();
}

export async function getEducatorSubjects(
  supabase: SupabaseClient,
  profileId: string,
) {
  return supabase
    .from('educator_profile_subjects')
    .select(EDUCATOR_SUBJECTS_SELECT)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .returns<EducatorProfileSubjectRow[]>();
}

export async function getEducatorGradeLevels(
  supabase: SupabaseClient,
  profileId: string,
) {
  return supabase
    .from('educator_profile_grade_levels')
    .select(EDUCATOR_GRADE_LEVELS_SELECT)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .returns<EducatorProfileGradeLevelRow[]>();
}

export async function getEducatorCurriculumTags(
  supabase: SupabaseClient,
  profileId: string,
) {
  return supabase
    .from('educator_profile_curriculum_tags')
    .select(EDUCATOR_CURRICULUM_TAGS_SELECT)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .returns<EducatorProfileCurriculumTagRow[]>();
}

export async function getEducatorBadges(
  supabase: SupabaseClient,
  profileId: string,
) {
  return supabase
    .from('educator_profile_badges')
    .select(EDUCATOR_BADGES_SELECT)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .returns<EducatorProfileBadgeRow[]>();
}
