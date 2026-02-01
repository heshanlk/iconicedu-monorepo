import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { ORG_ID } from '@iconicedu/web/lib/data/ids';
import type { ChannelRow, ChannelMemberRow } from '@iconicedu/shared-types';
import {
  getChannelsByOrg,
  getChannelParticipantsByChannelIds,
} from '@iconicedu/web/lib/channels/queries/channels.query';

export type AdminChannelRow = ChannelRow & {
  participantCount: number;
};

export function filterDirectMessageChannels(rows: AdminChannelRow[]) {
  return rows.filter((row) => row.kind === 'dm' || row.kind === 'group_dm');
}

export async function getAdminChannelRows(): Promise<AdminChannelRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data: channels } = await getChannelsByOrg(supabase, ORG_ID);

  if (!channels?.length) {
    return [];
  }

  const channelIds = channels.map((row) => row.id);
  const membersResponse = await getChannelParticipantsByChannelIds(
    supabase,
    ORG_ID,
    channelIds,
  );
  const members = membersResponse.data ?? [];

  const countsByChannel = new Map<string, number>();
  members.forEach((row: ChannelMemberRow) => {
    countsByChannel.set(row.channel_id, (countsByChannel.get(row.channel_id) ?? 0) + 1);
  });

  return channels.map((row) => ({
    ...row,
    participantCount: countsByChannel.get(row.id) ?? 0,
  }));
}

export async function getAdminDirectMessageRows(): Promise<AdminChannelRow[]> {
  const rows = await getAdminChannelRows();
  return filterDirectMessageChannels(rows);
}
