'use client';

import { useRef, useEffect, memo } from 'react';
import { MessageInput } from './message-input';
import type { ThreadPanelProps } from '@iconicedu/shared-types';
import { ScrollArea } from '../../ui/scroll-area';
import { ThreadMessageList } from './shared/thread-message-list';

export const ThreadPanel = memo(function ThreadPanel({
  thread,
  messages,
  onSendReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved,
  onToggleHidden,
  currentUserId,
  lastReadMessageId,
}: ThreadPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > messageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    messageCountRef.current = messages.length;
  }, [messages]);

  return (
    <>
      <ScrollArea className="flex-1 px-2 py-4">
        <ThreadMessageList
          messages={messages}
          onProfileClick={onProfileClick}
          onToggleReaction={onToggleReaction}
          onToggleSaved={onToggleSaved}
          onToggleHidden={onToggleHidden}
          currentUserId={currentUserId}
          lastReadMessageId={lastReadMessageId}
        />
        <div ref={bottomRef} />
      </ScrollArea>

      <MessageInput onSend={onSendReply} placeholder="Reply..." />
    </>
  );
});
