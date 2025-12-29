'use client';

import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { SavedMessagesPanel } from '../saved-messages-panel';
import { useMessagesRightSidebar } from '../messages-right-sidebar-provider';

interface SavedPanelProps {
  intent: MessagesRightPanelIntent;
}

export function SavedPanel(_: SavedPanelProps) {
  const { messages, scrollToMessage, close } = useMessagesRightSidebar();
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
