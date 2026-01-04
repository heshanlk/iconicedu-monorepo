import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getAccountByAuthUserId, insertAccountForAuthUser } from '../sidebar/user/queries/accounts.query';

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
