import type { SupabaseClient } from '@supabase/supabase-js';

import type { AccountRow } from '@iconicedu/shared-types';

import { ACCOUNT_SELECT } from '../constants/selects';

type AccountInsertPayload = {
  orgId: string;
  authUserId: string;
  email: string | null;
};

export async function getAccountByAuthUserId(
  supabase: SupabaseClient,
  authUserId: string,
) {
  return supabase
    .from('accounts')
    .select('id, org_id')
    .eq('auth_user_id', authUserId)
    .is('deleted_at', null)
    .maybeSingle();
}

export async function insertAccountForAuthUser(
  supabase: SupabaseClient,
  payload: AccountInsertPayload,
) {
  return supabase
    .from('accounts')
    .insert({
      org_id: payload.orgId,
      auth_user_id: payload.authUserId,
      email: payload.email,
      preferred_contact_channels: ['email'],
      status: 'active',
    })
    .select('id, org_id')
    .single();
}

export async function getAccountById(supabase: SupabaseClient, accountId: string) {
  return supabase
    .from('accounts')
    .select(ACCOUNT_SELECT)
    .eq('id', accountId)
    .maybeSingle<AccountRow>();
}
