import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { ORG_ID } from '@iconicedu/web/lib/data/ids';
import type { LearningSpaceParticipantRow, LearningSpaceRow, ProfileRow } from '@iconicedu/shared-types';
import { getLearningSpacesByOrg } from '@iconicedu/web/lib/spaces/queries/learning-spaces.query';
import { getLearningSpaceParticipantsByLearningSpaceIds } from '@iconicedu/web/lib/spaces/queries/learning-space-relations.query';
import { getProfilesByIds } from '@iconicedu/web/lib/profile/queries/profiles.query';

export type AdminLearningSpaceRow = LearningSpaceRow & {
  participantNames: string[];
};

function getProfileDisplayName(profile: ProfileRow) {
  const display = profile.display_name?.trim();
  if (display) return display;
  const fallback = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
  return fallback || 'Unknown';
}

export async function getAdminLearningSpaceRows(): Promise<AdminLearningSpaceRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await getLearningSpacesByOrg(supabase, ORG_ID);

  if (!data?.length) {
    return [];
  }

  const learningSpaceIds = data.map((row) => row.id);
  const { data: participants } = await getLearningSpaceParticipantsByLearningSpaceIds(
    supabase,
    ORG_ID,
    learningSpaceIds,
  );

  const participantsBySpace = new Map<string, LearningSpaceParticipantRow[]>();
  (participants ?? []).forEach((row) => {
    const bucket = participantsBySpace.get(row.learning_space_id) ?? [];
    bucket.push(row);
    participantsBySpace.set(row.learning_space_id, bucket);
  });

  const profileIds = Array.from(
    new Set((participants ?? []).map((row) => row.profile_id)),
  );
  const { data: profiles } = await getProfilesByIds(supabase, ORG_ID, profileIds);
  const profilesById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  return data.map((row) => ({
    ...row,
    participantNames: (participantsBySpace.get(row.id) ?? [])
      .map((participant) => profilesById.get(participant.profile_id))
      .filter((profile): profile is ProfileRow => Boolean(profile))
      .map(getProfileDisplayName),
  }));
}
