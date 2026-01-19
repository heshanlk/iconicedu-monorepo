import type { EducatorAvailabilityVM, EducatorProfileVM, GradeLevel, UserProfileVM } from '@iconicedu/shared-types';
import type { ProfileRow } from '@iconicedu/shared-types';
import type { SupabaseClient } from '@supabase/supabase-js';

import {
  getEducatorAvailability,
  getEducatorBadges,
  getEducatorCurriculumTags,
  getEducatorGradeLevels,
  getEducatorProfile,
  getEducatorSubjects,
} from '../queries/educator.query';
import { parseGradeLevel } from '@iconicedu/shared-types';

export async function buildEducatorProfile(
  supabase: SupabaseClient,
  baseProfile: Omit<UserProfileVM, 'kind'>,
  profileRow: ProfileRow,
): Promise<EducatorProfileVM> {
  const [educator, subjects, grades, tags, badges, availabilityResponse] =
    await Promise.all([
      getEducatorProfile(supabase, profileRow.id),
      getEducatorSubjects(supabase, profileRow.id),
      getEducatorGradeLevels(supabase, profileRow.id),
      getEducatorCurriculumTags(supabase, profileRow.id),
      getEducatorBadges(supabase, profileRow.id),
      getEducatorAvailability(supabase, profileRow.id),
    ]);

  const gradeLevels: GradeLevel[] | null = grades.data
    ? grades.data
        .map((row) => parseGradeLevel(row.grade_id) ?? parseGradeLevel(row.grade_label))
        .filter((item): item is GradeLevel => Boolean(item))
    : null;

  const availability: EducatorAvailabilityVM | null = availabilityResponse.data
    ? {
        classTypes: availabilityResponse.data.class_types ?? null,
        weeklyCommitment: availabilityResponse.data.weekly_commitment ?? null,
        availability: availabilityResponse.data.availability ?? null,
      }
    : null;

  return {
    ...baseProfile,
    kind: 'educator',
    headline: educator.data?.headline ?? null,
    subjects: subjects.data?.map((row) => row.subject) ?? null,
    gradesSupported: gradeLevels,
    education: educator.data?.education ?? null,
    experienceYears: educator.data?.experience_years ?? null,
    certifications: educator.data?.certifications ?? null,
    joinedDate: educator.data?.joined_date ?? profileRow.created_at,
    ageGroupsComfortableWith: educator.data?.age_groups_comfortable_with ?? null,
    identityVerificationStatus: educator.data?.identity_verification_status ?? null,
    curriculumTags: tags.data?.map((row) => row.tag) ?? null,
    badges: badges.data?.map((row) => row.badge) ?? null,
    averageRating: educator.data?.average_rating ?? null,
    totalReviews: educator.data?.total_reviews ?? null,
    featuredVideoIntroUrl: educator.data?.featured_video_intro_url ?? null,
    availability,
  };
}
