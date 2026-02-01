import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  type ReactNode,
} from 'react';
import { MessageItem } from '@iconicedu/ui-web/components/messages/message-item';
import { EmptyMessagesState } from '@iconicedu/ui-web/components/messages/empty-state';
import type { MessageVM, ThreadVM } from '@iconicedu/shared-types';
import { ScrollArea } from '@iconicedu/ui-web/ui/scroll-area';
import { formatDateHeader } from '@iconicedu/ui-web/lib/message-utils';

interface MessageListProps {
  messages: MessageVM[];
  onOpenThread: (thread: ThreadVM, parentMessage: MessageVM) => void;
  onProfileClick: (userId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onToggleSaved?: (messageId: string) => void;
  onToggleHidden?: (messageId: string) => void;
  currentUserId?: string;
  lastReadMessageId?: string;
  typingIndicator?: ReactNode;
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
      typingIndicator,
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
      const typingVisible = Boolean(typingIndicator);
      if (messages.length > messageCountRef.current || typingVisible) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      messageCountRef.current = messages.length;
    }, [messages, typingIndicator]);

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
        {messages.length === 0 ? (
          <div className="flex min-h-[70vh] w-full items-center justify-center">
            <EmptyMessagesState
              title="No messages yet"
              description="Looks like you have not started a conversation yet."
            />
          </div>
        ) : null}
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

        {typingIndicator}
        <div ref={bottomRef} />
      </ScrollArea>
    );
  },
);

MessageList.displayName = 'MessageList';
