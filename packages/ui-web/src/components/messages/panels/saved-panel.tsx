'use client';

import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { SavedMessagesPanel } from '../saved-messages-panel';
import { useMessagesState } from '../messages-state-provider';

interface SavedPanelProps {
  intent: MessagesRightPanelIntent;
}

export function SavedPanel(_: SavedPanelProps) {
  const { messages, scrollToMessage, close } = useMessagesState();
  return (
    <SavedMessagesPanel
      messages={messages}
      onMessageClick={(messageId) => {
        close();
        scrollToMessage?.(messageId);
      }}
    />
  );
}
