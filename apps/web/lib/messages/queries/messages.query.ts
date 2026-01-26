import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  MessageRow,
  ThreadRow,
  MessageReactionRow,
  ChannelFileRow,
  ChannelMediaRow,
} from '@iconicedu/shared-types';

import {
  MESSAGE_SELECT,
  THREAD_SELECT,
  MESSAGE_REACTION_SELECT,
  CHANNEL_FILE_SELECT,
  CHANNEL_MEDIA_SELECT,
} from '@iconicedu/web/lib/messages/constants/selects';

export async function getMessagesByChannelId(
  supabase: SupabaseClient,
  orgId: string,
  channelId: string,
) {
  return supabase
    .from<MessageRow>('messages')
    .select(MESSAGE_SELECT)
    .eq('org_id', orgId)
    .eq('channel_id', channelId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });
}

export async function getMessagesByChannelIds(
  supabase: SupabaseClient,
  orgId: string,
  channelIds: string[],
) {
  if (!channelIds.length) {
    return { data: [] as MessageRow[] };
  }

  return supabase
    .from<MessageRow>('messages')
    .select(MESSAGE_SELECT)
    .eq('org_id', orgId)
    .in('channel_id', channelIds)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });
}

export async function getThreadsByChannelId(
  supabase: SupabaseClient,
  orgId: string,
  channelId: string,
) {
  return supabase
    .from<ThreadRow>('threads')
    .select(THREAD_SELECT)
    .eq('org_id', orgId)
    .eq('channel_id', channelId)
    .is('deleted_at', null);
}

export async function getMessageReactionsByMessageIds(
  supabase: SupabaseClient,
  orgId: string,
  messageIds: string[],
) {
  if (!messageIds.length) {
    return { data: [] as MessageReactionRow[] };
  }

  return supabase
    .from<MessageReactionRow>('message_reactions')
    .select(MESSAGE_REACTION_SELECT)
    .eq('org_id', orgId)
    .in('message_id', messageIds)
    .is('deleted_at', null);
}

export async function getChannelFilesByChannelIds(
  supabase: SupabaseClient,
  orgId: string,
  channelIds: string[],
) {
  if (!channelIds.length) {
    return { data: [] as ChannelFileRow[] };
  }

  return supabase
    .from<ChannelFileRow>('channel_files')
    .select(CHANNEL_FILE_SELECT)
    .eq('org_id', orgId)
    .in('channel_id', channelIds)
    .is('deleted_at', null);
}

export async function getChannelMediaByChannelIds(
  supabase: SupabaseClient,
  orgId: string,
  channelIds: string[],
) {
  if (!channelIds.length) {
    return { data: [] as ChannelMediaRow[] };
  }

  return supabase
    .from<ChannelMediaRow>('channel_media')
    .select(CHANNEL_MEDIA_SELECT)
    .eq('org_id', orgId)
    .in('channel_id', channelIds)
    .is('deleted_at', null);
}
