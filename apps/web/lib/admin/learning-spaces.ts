import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { ORG } from '@iconicedu/web/lib/data/org';
import type { LearningSpaceRow } from '@iconicedu/shared-types';
import { getLearningSpacesByOrg } from '@iconicedu/web/lib/spaces/queries/learning-spaces.query';

export async function getAdminLearningSpaceRows(): Promise<LearningSpaceRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await getLearningSpacesByOrg(supabase, ORG.id);

  if (!data) {
    return [];
  }

  return data;
}
