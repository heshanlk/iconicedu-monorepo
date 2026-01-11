'use server';

import { createSupabaseServerClient } from '../../lib/supabase/server';
import { getAccountByAuthUserId } from '../../lib/sidebar/user/queries/accounts.query';

type RemoveFamilyMemberInput = {
  childAccountId: string;
};

export async function removeFamilyMemberAction(
  input: RemoveFamilyMemberInput,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const accountResponse = await getAccountByAuthUserId(supabase, user.id);
  if (!accountResponse.data) {
    throw new Error('Guardian account record not found');
  }

  const guardianAccount = accountResponse.data;
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('family_links')
    .update({
      deleted_at: now,
      deleted_by: guardianAccount.id,
    })
    .eq('org_id', guardianAccount.org_id)
    .eq('guardian_account_id', guardianAccount.id)
    .eq('child_account_id', input.childAccountId)
    .is('deleted_at', null);

  if (error) {
    throw error;
  }
}
