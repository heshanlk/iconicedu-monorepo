import { useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { MessageItem } from './message-item';
import type { MessageVM, ThreadVM } from '@iconicedu/shared-types';
import { ScrollArea } from '../../ui/scroll-area';
import { formatDateHeader } from '../../lib/message-utils';

interface MessageListProps {
  messages: MessageVM[];
  onOpenThread: (thread: ThreadVM, parentMessage: MessageVM) => void;
  onProfileClick: (userId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onToggleSaved?: (messageId: string) => void;
  onToggleHidden?: (messageId: string) => void;
  currentUserId?: string;
  lastReadMessageId?: string;
}

export interface MessageListRef {
  scrollToMessage: (messageId: string) => void;
}

export const MessageList = forwardRef<MessageListRef, MessageListProps>(
  (
    {
      messages,
      onOpenThread,
      onProfileClick,
      onToggleReaction,
      onToggleSaved,
      onToggleHidden,
      currentUserId,
      lastReadMessageId,
    },
    ref,
  ) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const messageCountRef = useRef(messages.length);
    const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    useImperativeHandle(ref, () => ({
      scrollToMessage: (messageId: string) => {
        const messageElement = messageRefs.current.get(messageId);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          messageElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
          // eslint-disable-next-line no-undef
          setTimeout(() => {
            messageElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
          }, 2000);
        }
      },
    }));

    useEffect(() => {
      if (messages.length > messageCountRef.current) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      messageCountRef.current = messages.length;
    }, [messages]);

    const groupedMessages = useMemo(() => {
      const groups: { date: string; messages: MessageVM[] }[] = [];
      let currentDate = '';

      const sortedMessages = [...messages].sort(
        (a, b) =>
          new Date(a.core.createdAt).getTime() - new Date(b.core.createdAt).getTime(),
      );

      sortedMessages.forEach((message) => {
        const messageDate = formatDateHeader(message.core.createdAt);
        if (messageDate !== currentDate) {
          currentDate = messageDate;
          groups.push({ date: messageDate, messages: [message] });
        } else {
          groups[groups.length - 1].messages.push(message);
        }
      });

      return groups;
    }, [messages]);

    return (
      <ScrollArea className="flex-1 min-h-0">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="relative my-4 flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="mx-4 text-xs font-medium text-muted-foreground bg-background px-2">
                {group.date}
              </span>
              <div className="flex-1 border-t border-border" />
            </div>
            {group.messages.map((message, index) => {
              const previousMessage = index > 0 ? group.messages[index - 1] : null;
              const showUnreadDivider =
                !!lastReadMessageId &&
                previousMessage?.ids.id === lastReadMessageId &&
                message.ids.id !== lastReadMessageId;

              return (
                <div
                  key={message.ids.id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(message.ids.id, el);
                    else messageRefs.current.delete(message.ids.id);
                  }}
                  className="transition-all duration-300"
                >
                  {showUnreadDivider && (
                    <div className="relative my-6 flex items-center">
                      <div className="flex-1 border-t-2 border-destructive" />
                      <span className="mx-4 text-xs font-bold text-destructive bg-background px-3 py-1 rounded-full">
                        NEW
                      </span>
                      <div className="flex-1 border-t-2 border-destructive" />
                    </div>
                  )}
                  <MessageItem
                    message={message}
                    onOpenThread={onOpenThread}
                    onProfileClick={onProfileClick}
                    onToggleReaction={onToggleReaction}
                    onToggleSaved={onToggleSaved}
                    onToggleHidden={onToggleHidden}
                    currentUserId={currentUserId}
                  />
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </ScrollArea>
    );
  },
);

MessageList.displayName = 'MessageList';
