import type { ChildProfileVM, GradeLevelOption, UserProfileVM } from '@iconicedu/shared-types';
import type { ProfileRow } from '@iconicedu/shared-types';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getChildGradeLevel, getChildProfile } from '../queries/child.query';

export async function buildChildProfile(
  supabase: SupabaseClient,
  baseProfile: Omit<UserProfileVM, 'kind'>,
  profileRow: ProfileRow,
): Promise<ChildProfileVM> {
  const [child, grade] = await Promise.all([
    getChildProfile(supabase, profileRow.id),
    getChildGradeLevel(supabase, profileRow.id),
  ]);

  const gradeLevel: GradeLevelOption | null = grade.data
    ? {
        id: grade.data.grade_id,
        label: grade.data.grade_label ?? grade.data.grade_id,
      }
    : null;

  return {
    ...baseProfile,
    kind: 'child',
    gradeLevel,
    birthYear: child.data?.birth_year ?? null,
    schoolName: child.data?.school_name ?? null,
    schoolYear: child.data?.school_year ?? null,
    interests: null,
    strengths: null,
    learningPreferences: null,
    motivationStyles: null,
    confidenceLevel: child.data?.confidence_level ?? null,
    communicationStyle: child.data?.communication_style ?? null,
  };
}
