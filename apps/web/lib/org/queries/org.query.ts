import type { SupabaseClient } from '@supabase/supabase-js';
import { ORG_SELECT } from '../constants/selects';

type OrgRow = {
  id: string;
  name: string;
  slug: string;
};

export async function getOrgById(supabase: SupabaseClient, orgId: string) {
  return supabase
    .from<OrgRow>('orgs')
    .select(ORG_SELECT)
    .eq('id', orgId)
    .is('deleted_at', null)
    .maybeSingle<OrgRow>();
}

export async function getOrgBySlug(supabase: SupabaseClient, slug: string) {
  return supabase
    .from<OrgRow>('orgs')
    .select(ORG_SELECT)
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle<OrgRow>();
}
