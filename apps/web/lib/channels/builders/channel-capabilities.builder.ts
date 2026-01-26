import type { SupabaseClient } from '@supabase/supabase-js';
import type { ChannelCapabilityRecordVM } from '@iconicedu/shared-types';

import { getChannelCapabilitiesByChannelIds } from '@iconicedu/web/lib/channels/queries/channels.query';
import { mapChannelCapabilityRowToRecordVM } from '@iconicedu/web/lib/channels/mappers/channel.mapper';

export async function buildChannelCapabilitiesByChannelIds(
  supabase: SupabaseClient,
  orgId: string,
  channelIds: string[],
): Promise<ChannelCapabilityRecordVM[]> {
  const response = await getChannelCapabilitiesByChannelIds(supabase, orgId, channelIds);
  return (response.data ?? []).map(mapChannelCapabilityRowToRecordVM);
}
