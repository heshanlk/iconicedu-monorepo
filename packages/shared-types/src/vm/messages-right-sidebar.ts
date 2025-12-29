import type { UUID } from './shared';

export type MessagesRightPanelIntent =
  | { key: 'channel_info' }
  | { key: 'saved' }
  | { key: 'pinned' }
  | { key: 'profile'; userId: UUID }
  | { key: 'thread'; threadId: string };

export type MessagesRightPanelIntentKey = MessagesRightPanelIntent['key'];

export interface MessagesRightSidebarState {
  isOpen: boolean;
  intent: MessagesRightPanelIntent | null;
  width?: number;
  pinned?: boolean;
}

export type MessagesRightPanelRegistry<T> = Record<MessagesRightPanelIntentKey, T>;
