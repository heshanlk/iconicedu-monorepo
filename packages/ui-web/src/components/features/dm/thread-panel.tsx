'use client';

import { useRef, useEffect, memo } from 'react';
import { MessageItem } from './message-item';
import { MessageInput } from './message-input';
import type { ThreadPanelProps } from '../../../types/types';

const UnreadDivider = memo(function UnreadDivider() {
  return (
    <div className="relative my-4 flex items-center px-2">
      <div className="flex-1 border-t-2 border-destructive" />
      <span className="mx-3 text-xs font-bold text-destructive bg-background px-3 py-1 rounded-full">
        NEW
      </span>
      <div className="flex-1 border-t-2 border-destructive" />
    </div>
  );
});

const ReplyDivider = memo(function ReplyDivider({ count }: { count: number }) {
  return (
    <div className="relative my-3 flex items-center px-2">
      <div className="flex-1 border-t border-border" />
      <span className="mx-3 text-xs text-muted-foreground">
        {count} {count === 1 ? 'reply' : 'replies'}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
});

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

  const handleOpenThread = () => {
    // Nested threads not supported in this view
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null;
          const showUnreadDivider =
            lastReadMessageId &&
            previousMessage?.id === lastReadMessageId &&
            message.id !== lastReadMessageId;

          return (
            <div key={message.id}>
              {showUnreadDivider && <UnreadDivider />}
              <MessageItem
                message={message}
                onOpenThread={handleOpenThread}
                isThreadReply={index > 0}
                onProfileClick={onProfileClick}
                onToggleReaction={onToggleReaction}
                onToggleSaved={onToggleSaved}
                onToggleHidden={onToggleHidden}
                currentUserId={currentUserId}
              />
              {index === 0 && messages.length > 1 && (
                <ReplyDivider count={messages.length - 1} />
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSendReply} placeholder="Reply..." />
    </>
  );
});
