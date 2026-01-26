import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { ORG_ID } from '@iconicedu/web/lib/data/ids';
import type { LearningSpaceRow } from '@iconicedu/shared-types';
import { getLearningSpacesByOrg } from '@iconicedu/web/lib/spaces/queries/learning-spaces.query';

export async function getAdminLearningSpaceRows(): Promise<LearningSpaceRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await getLearningSpacesByOrg(supabase, ORG_ID);

  if (!data) {
    return [];
  }

  return data;
}
