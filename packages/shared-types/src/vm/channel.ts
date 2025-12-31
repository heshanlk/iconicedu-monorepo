import type { ConnectionVM, EntityRefVM, ISODateTime, UUID } from './shared';
import type { UserProfileVM } from './profile';
import type { ChannelReadStateVM, MessageVM } from './message';
import type { MessagesRightPanelIntentKey } from './message';

export type ChannelKind = 'channel' | 'dm' | 'group_dm';
export type ChannelPurpose = 'learning-space' | 'general' | 'support' | 'announcements';
export type ChannelVisibility = 'private' | 'public';
export type ChannelStatus = 'active' | 'archived';

export type ChannelTopicIconKey = string;

export type ChannelHeaderIconKey =
  | 'saved'
  | 'next-session'
  | 'last-seen'
  | 'info'
  | 'homework'
  | 'session-summary';

export interface ChannelPostingPolicyVM {
  kind: 'everyone' | 'members-only' | 'staff-only' | 'read-only' | 'owners_only';
  allowThreads?: boolean;
  allowReactions?: boolean;
}

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

export type ChannelCapabilityVM = 'has_schedule' | 'has_homework' | 'has_summaries';

export interface ChannelContextVM {
  primaryEntity?: EntityRefVM | null;
  capabilities?: ChannelCapabilityVM[] | null;
}

export interface ChannelIdsVM {
  id: UUID;
  orgId: UUID;
}

export interface ChannelBasicsVM {
  kind: ChannelKind;

  topic: string;
  topicIconKey?: ChannelTopicIconKey | null;
  description?: string | null;

  visibility: ChannelVisibility;
  purpose: ChannelPurpose;
}

export interface ChannelLifecycleVM {
  status: ChannelStatus;
  createdBy: UUID;
  createdAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface ChannelDmVM {
  dmKey?: string | null;
}

export interface ChannelUiDefaultsVM {
  defaultRightPanelOpen?: boolean;
  defaultRightPanelKey?: MessagesRightPanelIntentKey;
}

export interface ChannelCollectionsVM {
  participants: UserProfileVM[];

  messages: ConnectionVM<MessageVM>;
  media: ConnectionVM<ChannelMediaItemVM>;
  files: ConnectionVM<ChannelFileItemVM>;

  readState?: ChannelReadStateVM;
}

export interface ChannelVM {
  ids: ChannelIdsVM;

  basics: ChannelBasicsVM;

  lifecycle: ChannelLifecycleVM;

  postingPolicy: ChannelPostingPolicyVM;

  headerItems: ChannelHeaderItemVM[];

  dm?: ChannelDmVM;

  context?: ChannelContextVM | null;

  collections: ChannelCollectionsVM;

  ui?: ChannelUiDefaultsVM;
}

export interface ChannelMiniVM {
  ids: ChannelIdsVM;

  basics: Pick<
    ChannelBasicsVM,
    'kind' | 'purpose' | 'topic' | 'topicIconKey' | 'visibility'
  >;

  lifecycle: Pick<ChannelLifecycleVM, 'status'>;

  dm?: ChannelDmVM;

  context?: ChannelContextVM | null;

  participants: UserProfileVM[];
}
