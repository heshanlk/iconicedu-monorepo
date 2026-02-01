import { randomUUID } from 'crypto';

import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { getAccountByAuthUserId } from '@iconicedu/web/lib/accounts/queries/accounts.query';
import { getProfileByAccountId } from '@iconicedu/web/lib/profile/queries/profiles.query';

type CreateChannelInput = {
  topic: string;
  description?: string | null;
  purpose?: string | null;
  kind?: string | null;
};

export async function createAdminChannel(input: CreateChannelInput) {
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

  const now = new Date().toISOString();
  const channelId = randomUUID();

  const { error } = await supabase.from('channels').insert({
    id: channelId,
    org_id: accountResponse.data.org_id,
    kind: input.kind ?? 'channel',
    topic: input.topic.trim(),
    description: input.description ?? null,
    icon_key: null,
    visibility: 'private',
    purpose: input.purpose ?? 'general',
    status: 'active',
    posting_policy_kind: 'members-only',
    allow_threads: true,
    allow_reactions: true,
    created_by_profile_id: profileResponse.data.id,
    created_at: now,
    created_by: profileResponse.data.id,
    updated_at: now,
    updated_by: profileResponse.data.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return channelId;
}
