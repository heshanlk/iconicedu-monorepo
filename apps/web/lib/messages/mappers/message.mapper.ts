import type {
  ChannelFileItemVM,
  ChannelFileKind,
  ChannelFileRow,
  ChannelMediaItemVM,
  ChannelMediaRow,
  MessageRow,
  MessageVM,
} from '@iconicedu/shared-types';

export function mapMessageRowToVM(row: MessageRow): MessageVM | null {
  void row;
  // Message payloads live in message_* tables; compose those before building MessageVM.
  return null;
}

export function mapChannelFileRow(row: ChannelFileRow): ChannelFileItemVM {
  return {
    ids: { id: row.id, orgId: row.org_id, channelId: row.channel_id },
    messageId: row.message_id ?? undefined,
    senderId: row.sender_profile_id ?? undefined,
    kind: (row.kind ?? 'file') as ChannelFileKind,
    url: row.url,
    name: row.name,
    mimeType: row.mime_type ?? undefined,
    size: row.size ?? undefined,
    tool: row.tool ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapChannelMediaRow(row: ChannelMediaRow): ChannelMediaItemVM {
  return {
    ids: { id: row.id, orgId: row.org_id, channelId: row.channel_id },
    messageId: row.message_id ?? undefined,
    senderId: row.sender_profile_id ?? undefined,
    type: row.type as ChannelMediaItemVM['type'],
    url: row.url,
    name: row.name ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    createdAt: row.created_at,
  };
}
