'use client';

import { useMemo, memo } from 'react';
import { ScrollArea } from '../../../ui/scroll-area';
import { SavedMessagePreview } from '../saved-message-preview';
import { Bookmark } from 'lucide-react';
import type { MessageVM, MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { useMessagesState } from '../context/messages-state-provider';

interface SavedPanelProps {
  intent: MessagesRightPanelIntent;
}

interface SavedMessagesPanelProps {
  messages: MessageVM[];
  onMessageClick: (messageId: string) => void;
}

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Bookmark className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-foreground">No saved messages</h3>
        <p className="text-xs text-muted-foreground">
          Save important messages by clicking the bookmark icon
        </p>
      </div>
    </div>
  );
});

const SavedMessagesPanel = memo(function SavedMessagesPanel({
  messages,
  onMessageClick,
}: SavedMessagesPanelProps) {
  const savedMessages = useMemo(() => {
    return messages.filter((msg) => msg.state?.isSaved);
  }, [messages]);

  if (savedMessages.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-2 p-4">
        {savedMessages.map((message) => (
          <SavedMessagePreview
            key={message.ids.id}
            message={message}
            onClick={() => onMessageClick(message.ids.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
});

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
