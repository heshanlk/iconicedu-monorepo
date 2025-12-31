'use client';

import { memo } from 'react';
import type { MessageVM } from '@iconicedu/shared-types';
import { MessageItem } from '../message-item';

interface ThreadMessageListProps {
  messages: MessageVM[];
  onProfileClick: (userId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onToggleSaved?: (messageId: string) => void;
  onToggleHidden?: (messageId: string) => void;
  currentUserId?: string;
  lastReadMessageId?: string;
}

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

export const ThreadMessageList = memo(function ThreadMessageList({
  messages,
  onProfileClick,
  onToggleReaction,
  onToggleSaved,
  onToggleHidden,
  currentUserId,
  lastReadMessageId,
}: ThreadMessageListProps) {
  const handleOpenThread = () => {
    // Nested threads not supported in this view
  };

  return (
    <>
      {messages.map((message, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const showUnreadDivider =
          lastReadMessageId &&
          previousMessage?.ids.id === lastReadMessageId &&
          message.ids.id !== lastReadMessageId;

        return (
          <div key={message.ids.id}>
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
    </>
  );
});
