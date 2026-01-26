import type { SupabaseClient } from '@supabase/supabase-js';
import type { FamilyLinkInviteRow } from '@iconicedu/shared-types';
import type { FamilyLinkRow } from '@iconicedu/shared-types';

import {
  FAMILY_INVITE_SELECT,
  FAMILY_LINK_SELECT,
  FAMILY_SELECT,
} from '../constants/selects';

export type FamilyRow = {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

export async function getFamiliesByOrg(
  supabase: SupabaseClient,
  orgId: string,
) {
  return supabase
    .from<FamilyRow>('families')
    .select(FAMILY_SELECT)
    .eq('org_id', orgId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
}

export async function getFamilyLinksByFamilyIds(
  supabase: SupabaseClient,
  orgId: string,
  familyIds: string[],
) {
  if (!familyIds.length) {
    return { data: [] as FamilyLinkRow[] };
  }
  return supabase
    .from<FamilyLinkRow>('family_links')
    .select(FAMILY_LINK_SELECT)
    .in('family_id', familyIds)
    .eq('org_id', orgId)
    .is('deleted_at', null);
}

export async function getFamilyLinksByOrg(
  supabase: SupabaseClient,
  orgId: string,
) {
  return supabase
    .from<FamilyLinkRow>('family_links')
    .select(FAMILY_LINK_SELECT)
    .eq('org_id', orgId)
    .is('deleted_at', null);
}

export async function deleteFamilyLinksByGuardianAccountId(
  supabase: SupabaseClient,
  orgId: string,
  guardianAccountId: string,
) {
  return supabase
    .from('family_links')
    .delete()
    .eq('guardian_account_id', guardianAccountId)
    .eq('org_id', orgId);
}

export async function getFamilyInvitesByFamilyIds(
  supabase: SupabaseClient,
  orgId: string,
  familyIds: string[],
) {
  if (!familyIds.length) {
    return { data: [] as FamilyLinkInviteRow[] };
  }
  return supabase
    .from<FamilyLinkInviteRow>('family_link_invites')
    .select(FAMILY_INVITE_SELECT)
    .in('family_id', familyIds)
    .eq('org_id', orgId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
}
