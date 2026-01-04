import type { SupabaseClient } from '@supabase/supabase-js';

import type { UserRoleRow } from '@iconicedu/shared-types';

import { ROLE_SELECT } from '../constants/selects';

export async function getUserRoles(
  supabase: SupabaseClient,
  accountId: string,
  orgId: string,
) {
  return supabase
    .from('user_roles')
    .select(ROLE_SELECT)
    .eq('account_id', accountId)
    .eq('org_id', orgId)
    .is('deleted_at', null)
    .returns<UserRoleRow[]>();
}
