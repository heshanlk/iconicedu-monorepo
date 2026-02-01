'use server';

import type { MessageSendTextInput, MessageVM } from '@iconicedu/shared-types';

import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { requireAuthedUser } from '@iconicedu/web/lib/auth/requireAuthedUser';
import { getAccountByAuthUserId } from '@iconicedu/web/lib/accounts/queries/accounts.query';
import { getProfileByAccountId } from '@iconicedu/web/lib/profile/queries/profiles.query';
import { buildUserProfileById } from '@iconicedu/web/lib/profile/builders/user-profile.builder';
import { mapMessageRowToVM } from '@iconicedu/web/lib/messages/mappers/message.mapper';

export async function sendTextMessageAction(
  input: MessageSendTextInput,
): Promise<MessageVM> {
  const supabase = await createSupabaseServerClient();
  const authUser = await requireAuthedUser(supabase);
  const accountResponse = await getAccountByAuthUserId(supabase, authUser.id);

  if (!accountResponse.data) {
    throw new Error('Account not found');
  }

  const profileResponse = await getProfileByAccountId(supabase, accountResponse.data.id);
  if (!profileResponse.data) {
    throw new Error('Profile not found');
  }

  if (input.orgId !== accountResponse.data.org_id) {
    throw new Error('Invalid org');
  }
  if (input.senderProfileId !== profileResponse.data.id) {
    throw new Error('Invalid sender');
  }

  const now = new Date().toISOString();
  const messageInsert = await supabase
    .from('messages')
    .insert({
      org_id: accountResponse.data.org_id,
      channel_id: input.channelId,
      sender_profile_id: profileResponse.data.id,
      type: 'text',
      visibility_type: 'all',
      thread_id: input.threadId ?? null,
      thread_parent_id: input.threadParentId ?? null,
      created_at: now,
      created_by: profileResponse.data.id,
      updated_at: now,
      updated_by: profileResponse.data.id,
    })
    .select('*')
    .single();

  if (messageInsert.error || !messageInsert.data) {
    throw new Error(messageInsert.error?.message ?? 'Unable to create message.');
  }

  const payloadInsert = await supabase.from('message_text').insert({
    message_id: messageInsert.data.id,
    org_id: accountResponse.data.org_id,
    payload: { text: input.content },
    created_at: now,
    created_by: profileResponse.data.id,
    updated_at: now,
    updated_by: profileResponse.data.id,
  });

  if (payloadInsert.error) {
    await supabase.from('messages').delete().eq('id', messageInsert.data.id);
    throw new Error(payloadInsert.error.message);
  }

  const sender = await buildUserProfileById(supabase, profileResponse.data.id);
  if (!sender) {
    throw new Error('Sender not found');
  }

  return mapMessageRowToVM(messageInsert.data, {
    sender,
    payload: { text: input.content },
    reactions: [],
  });
}
