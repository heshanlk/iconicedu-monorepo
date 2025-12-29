import type { UUID } from './shared';

export type RightPanelIntent =
  | { key: 'channel_info' }
  | { key: 'saved' }
  | { key: 'pinned' }
  | { key: 'profile'; userId: UUID }
  | { key: 'thread'; threadId: string };

export type RightPanelIntentKey = RightPanelIntent['key'];

export interface RightSidebarState {
  isOpen: boolean;
  intent: RightPanelIntent | null;
  width?: number;
  pinned?: boolean;
}

export type RightPanelRegistry<T> = Record<RightPanelIntentKey, T>;
