import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserRoleVM } from '@iconicedu/shared-types';

import { getUserRoles } from '@iconicedu/web/lib/profile/queries/roles.query';
import { mapUserRoleRows } from '@iconicedu/web/lib/profile/mappers/roles.mapper';

export async function buildUserRolesByAccountId(
  supabase: SupabaseClient,
  accountId: string,
  orgId: string,
): Promise<UserRoleVM[]> {
  const response = await getUserRoles(supabase, accountId, orgId);
  return mapUserRoleRows(response.data);
}
