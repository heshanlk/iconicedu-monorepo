import type { ConnectionVM, EntityRefVM, ISODateTime, UUID } from './shared';
import type { UserProfileVM } from './profile';
import type { ChannelReadStateVM, MessageVM } from './message';
import type { MessagesRightPanelIntentKey } from './message';

export type ChannelVisibility = 'private' | 'public';
export type ChannelStatus = 'active' | 'archived';
export type ChannelPurpose = 'learning-space' | 'general' | 'support' | 'announcements';
export type ChannelKind = 'channel' | 'dm' | 'group_dm';

export interface ChannelPostingPolicyVM {
  kind: 'everyone' | 'members-only' | 'staff-only' | 'read-only' | 'owners_only';
  allowThreads?: boolean;
  allowReactions?: boolean;
}

export type ChannelTopicIconKey = string;
export type ChannelHeaderIconKey =
  | 'saved'
  | 'next-session'
  | 'last-seen'
  | 'info'
  | 'homework'
  | 'session-summary';

export interface ChannelHeaderItemVM {
  key: ChannelHeaderIconKey;
  label: string;
  tooltip?: string | null;
  isPrimary?: boolean;
}

export type ChannelMediaType = 'image';

export interface ChannelMediaItemVM {
  id: UUID;
  channelId: UUID;
  messageId?: UUID | null;
  senderId?: UUID | null;
  type: ChannelMediaType;
  url: string;
  name?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: ISODateTime;
}

export type ChannelFileKind = 'file' | 'design-file';

export interface ChannelFileItemVM {
  id: UUID;
  channelId: UUID;
  messageId?: UUID | null;
  senderId?: UUID | null;
  kind: ChannelFileKind;
  url: string;
  name: string;
  mimeType?: string | null;
  size?: number | null;
  tool?: string | null;
  createdAt: ISODateTime;
}


export interface ChannelContextVM {
  primaryEntity?: EntityRefVM | null;

  
  capabilities?: Array<'has_schedule' | 'has_homework' | 'has_summaries'>;
}

export interface ChannelVM {
  id: UUID;
  orgId: UUID;
  kind: ChannelKind;

  topic: string;
  topicIconKey?: ChannelTopicIconKey | null;
  description?: string | null;

  visibility: ChannelVisibility;
  purpose: ChannelPurpose;

  status: ChannelStatus;
  createdBy: UUID;
  createdAt: ISODateTime;
  archivedAt?: ISODateTime | null;

  postingPolicy: ChannelPostingPolicyVM;

  headerItems: ChannelHeaderItemVM[];

  
  dmKey?: string | null;

  
  context?: ChannelContextVM | null;

  participants: UserProfileVM[];
  messages: ConnectionVM<MessageVM>;
  media: ConnectionVM<ChannelMediaItemVM>;
  files: ConnectionVM<ChannelFileItemVM>;
  readState?: ChannelReadStateVM;
  defaultRightPanelOpen?: boolean;
  defaultRightPanelKey?: MessagesRightPanelIntentKey;
}

export interface ChannelMiniVM {
  id: UUID;
  orgId: UUID;
  kind: ChannelKind;
  purpose: ChannelPurpose;
  topic: string;
  topicIconKey?: ChannelTopicIconKey | null;
  status: ChannelStatus;
  visibility: ChannelVisibility;

  
  dmKey?: string | null;
  context?: ChannelContextVM | null;

  participants: UserProfileVM[];
}
