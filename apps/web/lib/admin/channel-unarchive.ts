import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { getAccountByAuthUserId } from '@iconicedu/web/lib/accounts/queries/accounts.query';
import { getProfileByAccountId } from '@iconicedu/web/lib/profile/queries/profiles.query';

export async function unarchiveChannel(channelId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const accountResponse = await getAccountByAuthUserId(supabase, user.id);
  if (!accountResponse.data) {
    throw new Error('Account not found');
  }

  const profileResponse = await getProfileByAccountId(supabase, accountResponse.data.id);
  if (!profileResponse.data) {
    throw new Error('Profile not found');
  }

  const orgId = accountResponse.data.org_id;
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('channels')
    .update({
      status: 'active',
      archived_at: null,
      updated_at: now,
      updated_by: profileResponse.data.id,
    })
    .eq('org_id', orgId)
    .eq('id', channelId)
    .is('deleted_at', null);

  if (error) {
    throw new Error(error.message);
  }
}
