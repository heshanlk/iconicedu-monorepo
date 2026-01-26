import { createSupabaseServerClient } from '../supabase/server';
import { ORG } from '../data/org';
import {
  mapLearningSpaceRow,
  type LearningSpaceRow,
} from '../spaces/mappers/learning-space.mapper';
import { getLearningSpacesByOrg } from '../spaces/queries/learning-spaces.query';

export async function getAdminLearningSpaceRows(): Promise<LearningSpaceRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await getLearningSpacesByOrg(supabase, ORG.id);

  if (!data) {
    return [];
  }

  return data.map(mapLearningSpaceRow);
}
