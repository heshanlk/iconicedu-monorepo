import type { ChildProfileVM, GradeLevelOption, UserProfileVM } from '@iconicedu/shared-types';
import type { ChildProfileGradeLevelRow, ChildProfileRow, ProfileRow } from '@iconicedu/shared-types';
import type { SupabaseClient } from '@supabase/supabase-js';

import { mapBaseProfile } from '../mappers/base-profile.mapper';
import { resolveAvatarSource } from '../derive';
import { createSignedAvatarUrl } from '../queries/avatar.query';
import { getChildProfilesDetails } from '../queries/child.query';
import { getChildProfilesByAccountIds } from '../queries/profiles.query';

async function resolveAvatarUrl(
  supabase: SupabaseClient,
  avatarSource: string,
  avatarUrl: string | null,
) {
  if (!avatarUrl) {
    return null;
  }

  if (resolveAvatarSource(avatarSource) !== 'upload') {
    return avatarUrl;
  }

  const { data, error } = await createSignedAvatarUrl(supabase, avatarUrl);
  if (error) {
    return null;
  }

  return data?.signedUrl ?? null;
}

export async function loadChildProfiles(
  supabase: SupabaseClient,
  orgId: string,
  childAccountIds: string[],
): Promise<ChildProfileVM[]> {
  if (!childAccountIds.length) {
    return [];
  }

  const profiles = await getChildProfilesByAccountIds(supabase, orgId, childAccountIds);
  if (!profiles.data?.length) {
    return [];
  }

  const profileIds = profiles.data.map((row) => row.id);
  const { childRows, gradeRows } = await getChildProfilesDetails(
    supabase,
    profileIds,
  );

  const childByProfileId = new Map(
    ((childRows as ChildProfileRow[] | null) ?? []).map((row) => [row.profile_id, row]),
  );
  const gradeByProfileId = new Map(
    ((gradeRows as ChildProfileGradeLevelRow[] | null) ?? []).map((row) => [
      row.profile_id,
      row,
    ]),
  );

  const profilesWithAvatar = await Promise.all(
    profiles.data.map(async (row) => ({
      row,
      avatarUrl: await resolveAvatarUrl(supabase, row.avatar_source, row.avatar_url),
    })),
  );

  return profilesWithAvatar.map(({ row, avatarUrl }) => {
    const baseProfile: Omit<UserProfileVM, 'kind'> = mapBaseProfile(
      row as ProfileRow,
      {
        notificationDefaults: null,
        presence: null,
        avatarUrlOverride: avatarUrl,
      },
    );
    const child = childByProfileId.get(row.id);
    const grade = gradeByProfileId.get(row.id);
    const gradeLevel: GradeLevelOption | null = grade
      ? {
          id: grade.grade_id,
          label: grade.grade_label ?? grade.grade_id,
        }
      : null;

    return {
      ...baseProfile,
      kind: 'child',
      gradeLevel,
      birthYear: child?.birth_year ?? null,
      schoolName: child?.school_name ?? null,
      schoolYear: child?.school_year ?? null,
      interests: null,
      strengths: null,
      learningPreferences: null,
      motivationStyles: null,
      confidenceLevel: child?.confidence_level ?? null,
      communicationStyle: child?.communication_style ?? null,
    };
  });
}
