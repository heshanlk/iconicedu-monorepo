import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

import {
  getAccountByAuthUserId,
  getAccountByEmail,
  insertAccountForAuthUser,
  updateAccountAuthUserId,
  getAccountById,
} from '../sidebar/user/queries/accounts.query';

export async function getOrCreateAccount(
  supabase: SupabaseClient,
  input: { orgId: string; authUserId: string; authEmail?: string | null },
) {
  const { data: account } = await getAccountByAuthUserId(
    supabase,
    input.authUserId,
  );

  if (account) {
    return account;
  }

  const normalizedEmail = input.authEmail?.trim().toLowerCase();
  if (normalizedEmail) {
    const invitedAccount = await getAccountByEmail(
      supabase,
      input.orgId,
      normalizedEmail,
    );
    if (invitedAccount?.id) {
      const { data: updatedAccount, error: updateError } = await updateAccountAuthUserId(
        supabase,
        invitedAccount.id,
        input.authUserId,
      );
      if (updateError) {
        throw updateError;
      }
      if (updatedAccount) {
        return updatedAccount;
      }

      const refreshed = await getAccountById(supabase, invitedAccount.id);
      if (refreshed.data) {
        return refreshed.data;
      }

      throw new Error('Unable to load account after linking auth user.');
    }
  }

  const { data: inserted, error } = await insertAccountForAuthUser(supabase, {
    orgId: input.orgId,
    authUserId: input.authUserId,
    email: input.authEmail ?? null,
  });

  if (error || !inserted) {
    redirect('/login');
  }

  return inserted;
}
