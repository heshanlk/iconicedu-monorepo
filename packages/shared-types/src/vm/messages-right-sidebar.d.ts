import type { UUID } from './shared';
export type MessagesRightPanelIntent = {
    key: 'channel_info';
} | {
    key: 'saved';
} | {
    key: 'profile';
    userId: UUID;
} | {
    key: 'thread';
    threadId: string;
};
export type MessagesRightPanelIntentKey = MessagesRightPanelIntent['key'];
export interface MessagesRightSidebarState {
    isOpen: boolean;
    intent: MessagesRightPanelIntent | null;
    width?: number;
}
export type MessagesRightPanelRegistry<T> = Record<MessagesRightPanelIntentKey, T>;
//# sourceMappingURL=messages-right-sidebar.d.ts.map