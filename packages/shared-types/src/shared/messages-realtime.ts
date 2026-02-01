import type { MessageVM } from '../vm/message';

export type MessageRealtimeEvent =
  | { type: 'message-added'; message: MessageVM }
  | { type: 'message-updated'; message: MessageVM }
  | { type: 'message-deleted'; messageId: string };

export type MessagesRealtimeSubscription = {
  unsubscribe: () => void;
};

export interface MessagesRealtimeClient {
  subscribe: (input: {
    orgId: string;
    channelId: string;
    onEvent: (event: MessageRealtimeEvent) => void;
  }) =>
    | Promise<MessagesRealtimeSubscription | (() => void) | void>
    | MessagesRealtimeSubscription
    | (() => void)
    | void;
}

export type MessageSendTextInput = {
  orgId: string;
  channelId: string;
  senderProfileId: string;
  content: string;
  threadParentId?: string | null;
  threadId?: string | null;
};

export interface MessageWriteClient {
  sendTextMessage: (input: MessageSendTextInput) => Promise<MessageVM>;
}
