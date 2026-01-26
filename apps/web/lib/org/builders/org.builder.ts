import type { SupabaseClient } from '@supabase/supabase-js';
import type { OrgVM } from '@iconicedu/shared-types';

import { mapOrgRow } from '@iconicedu/web/lib/org/mappers/org.mapper';
import { getOrgById, getOrgBySlug } from '@iconicedu/web/lib/org/queries/org.query';

export async function buildOrgById(
  supabase: SupabaseClient,
  orgId: string,
): Promise<OrgVM | null> {
  const response = await getOrgById(supabase, orgId);
  return response.data ? mapOrgRow(response.data) : null;
}

export async function buildOrgBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<OrgVM | null> {
  const response = await getOrgBySlug(supabase, slug);
  return response.data ? mapOrgRow(response.data) : null;
}
