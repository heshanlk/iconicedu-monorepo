import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ChannelRow,
  ChannelMemberRow,
  ChannelCapabilityRow,
  ChannelReadStateRow,
} from '@iconicedu/shared-types';

import {
  CHANNEL_SELECT,
  CHANNEL_MEMBER_SELECT,
  CHANNEL_CAPABILITY_SELECT,
  CHANNEL_READ_STATE_SELECT,
} from '@iconicedu/web/lib/channels/constants/selects';

export async function getChannelsByOrg(supabase: SupabaseClient, orgId: string) {
  return supabase
    .from<ChannelRow>('channels')
    .select(CHANNEL_SELECT)
    .eq('org_id', orgId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
}

export async function getChannelById(
  supabase: SupabaseClient,
  orgId: string,
  channelId: string,
) {
  return supabase
    .from<ChannelRow>('channels')
    .select(CHANNEL_SELECT)
    .eq('org_id', orgId)
    .eq('id', channelId)
    .is('deleted_at', null)
    .maybeSingle();
}

export async function getChannelParticipantsByChannelIds(
  supabase: SupabaseClient,
  orgId: string,
  channelIds: string[],
) {
  if (!channelIds.length) {
    return { data: [] as ChannelMemberRow[] };
  }

  return supabase
    .from<ChannelMemberRow>('channel_members')
    .select(CHANNEL_MEMBER_SELECT)
    .eq('org_id', orgId)
    .in('channel_id', channelIds)
    .is('deleted_at', null);
}

export async function getChannelCapabilitiesByChannelIds(
  supabase: SupabaseClient,
  orgId: string,
  channelIds: string[],
) {
  if (!channelIds.length) {
    return { data: [] as ChannelCapabilityRow[] };
  }

  return supabase
    .from<ChannelCapabilityRow>('channel_capabilities')
    .select(CHANNEL_CAPABILITY_SELECT)
    .eq('org_id', orgId)
    .in('channel_id', channelIds)
    .is('deleted_at', null);
}

export async function getChannelReadStatesByAccountId(
  supabase: SupabaseClient,
  orgId: string,
  accountId: string,
) {
  return supabase
    .from<ChannelReadStateRow>('channel_read_state')
    .select(CHANNEL_READ_STATE_SELECT)
    .eq('org_id', orgId)
    .eq('account_id', accountId);
}
