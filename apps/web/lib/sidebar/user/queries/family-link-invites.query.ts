import type { SupabaseClient } from '@supabase/supabase-js';

import type { FamilyLinkInviteRow } from '@iconicedu/shared-types';

export async function getGuardianFamilyInvites(
  supabase: SupabaseClient,
  orgId: string,
  guardianAccountId: string,
) {
  return supabase
    .from('family_link_invites')
    .select('*')
    .eq('org_id', orgId)
    .eq('created_by_account_id', guardianAccountId)
    .eq('status', 'pending')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .returns<FamilyLinkInviteRow[]>();
}
