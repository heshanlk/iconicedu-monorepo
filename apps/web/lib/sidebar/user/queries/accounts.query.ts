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
    .select(ACCOUNT_SELECT)
    .eq('auth_user_id', authUserId)
    .is('deleted_at', null)
    .maybeSingle<AccountRow>();
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
    .is('deleted_at', null)
    .maybeSingle<AccountRow>();
}

export async function getAccountByEmail(
  supabase: SupabaseClient,
  orgId: string,
  email: string,
) {
  return supabase
    .from('accounts')
    .select(ACCOUNT_SELECT)
    .eq('org_id', orgId)
    .ilike('email', email)
    .is('deleted_at', null)
    .maybeSingle<AccountRow>();
}

export async function insertInvitedAccount(
  supabase: SupabaseClient,
  payload: { orgId: string; email: string; createdBy: string },
) {
  return supabase
    .from('accounts')
    .insert({
      org_id: payload.orgId,
      email: payload.email,
      preferred_contact_channels: ['email'],
      status: 'invited',
      created_by: payload.createdBy,
      updated_by: payload.createdBy,
    })
    .select(ACCOUNT_SELECT)
    .single<AccountRow>();
}

export async function updateAccountAuthUserId(
  supabase: SupabaseClient,
  accountId: string,
  authUserId: string,
) {
  return supabase
    .from('accounts')
    .update({
      auth_user_id: authUserId,
      status: 'active',
      updated_by: authUserId,
    })
    .eq('id', accountId)
    .select(ACCOUNT_SELECT)
    .single<AccountRow>();
}
