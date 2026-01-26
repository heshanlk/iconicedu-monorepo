import type {
  ChannelCapabilityRow,
  ChannelReadStateRow,
  ChannelRow,
  ChannelContextVM,
  ChannelCapabilityRecordVM,
  ChannelDmVM,
  ChannelMiniVM,
  ChannelReadStateVM,
  ChannelCapabilityVM,
  UserProfileVM,
} from '@iconicedu/shared-types';

export function mapChannelRowToMiniVM(
  row: ChannelRow,
  input?: {
    participants?: UserProfileVM[];
    context?: ChannelContextVM | null;
    dm?: ChannelDmVM | null;
  },
): ChannelMiniVM {
  return {
    ids: { id: row.id, orgId: row.org_id },
    basics: {
      kind: (row.kind ?? 'channel') as ChannelMiniVM['basics']['kind'],
      topic: row.topic,
      iconKey: row.icon_key ?? undefined,
      visibility: (row.visibility ?? 'private') as ChannelMiniVM['basics']['visibility'],
      purpose: (row.purpose ?? 'general') as ChannelMiniVM['basics']['purpose'],
    },
    lifecycle: {
      status: (row.status ?? 'active') as ChannelMiniVM['lifecycle']['status'],
    },
    dm: input?.dm ?? undefined,
    context: input?.context ?? null,
    participants: input?.participants ?? [],
  };
}

export function mapChannelCapabilityRow(
  row: ChannelCapabilityRow,
): ChannelCapabilityVM {
  return row.capability as ChannelCapabilityVM;
}

export function mapChannelCapabilityRowToRecordVM(
  row: ChannelCapabilityRow,
): ChannelCapabilityRecordVM {
  return {
    ids: {
      id: row.id,
      orgId: row.org_id,
      channelId: row.channel_id,
    },
    capability: row.capability as ChannelCapabilityRecordVM['capability'],
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}

export function mapChannelReadStateRow(
  row: ChannelReadStateRow,
): ChannelReadStateVM {
  return {
    channelId: row.channel_id,
    lastReadMessageId: row.last_read_message_id ?? undefined,
    lastReadAt: row.last_read_at ?? undefined,
    unreadCount: row.unread_count ?? undefined,
  };
}
