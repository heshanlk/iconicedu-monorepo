import { useRef, useEffect } from 'react';
import { MessageItem } from './message-item';
import { MessageInput } from './message-input';
import type { Message, Thread } from '@iconicedu/shared-types';

interface ThreadSheetProps {
  thread: Thread;
  messages: Message[];
  onSendReply: (content: string) => void;
  onProfileClick: (userId: string) => void;
  lastReadMessageId?: string;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onToggleSaved?: (messageId: string) => void;
  onToggleHidden?: (messageId: string) => void;
  currentUserId?: string;
}

export function ThreadSheet({
  thread,
  messages,
  onSendReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved,
  onToggleHidden,
  currentUserId,
  lastReadMessageId,
}: ThreadSheetProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > messageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    messageCountRef.current = messages.length;
  }, [messages]);

  const handleOpenThread = () => {
    // Nested threads not supported
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
              {showUnreadDivider && (
                <div className="relative my-4 flex items-center px-2">
                  <div className="flex-1 border-t-2 border-destructive" />
                  <span className="mx-3 text-xs font-bold text-destructive bg-background px-3 py-1 rounded-full">
                    NEW
                  </span>
                  <div className="flex-1 border-t-2 border-destructive" />
                </div>
              )}
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
                <div className="relative my-3 flex items-center px-2">
                  <div className="flex-1 border-t border-border" />
                  <span className="mx-3 text-xs text-muted-foreground">
                    {messages.length - 1}{' '}
                    {messages.length - 1 === 1 ? 'reply' : 'replies'}
                  </span>
                  <div className="flex-1 border-t border-border" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 border-t border-border">
        <MessageInput onSend={onSendReply} placeholder="Reply..." />
      </div>
    </>
  );
}
