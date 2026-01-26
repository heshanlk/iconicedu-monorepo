import type { SupabaseClient } from '@supabase/supabase-js';

import { LEARNING_SPACE_SELECT } from '@iconicedu/web/lib/spaces/constants/selects';

export type LearningSpaceDbRow = {
  id: string;
  title: string;
  kind: string;
  status: string;
  subject?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export async function getLearningSpacesByOrg(
  supabase: SupabaseClient,
  orgId: string,
) {
  return supabase
    .from<LearningSpaceDbRow>('learning_spaces')
    .select(LEARNING_SPACE_SELECT)
    .eq('org_id', orgId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
}
