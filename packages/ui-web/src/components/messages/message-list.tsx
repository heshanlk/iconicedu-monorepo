import { useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { MessageItem } from '@iconicedu/ui-web/components/messages/message-item';
import {
  Search,
  Trophy,
  BookOpen,
  GraduationCap,
  Pencil,
  Medal,
  BookOpenCheck,
} from 'lucide-react';
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
        {messages.length === 0 ? (
          <EmptyMessagesState />
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

        <div ref={bottomRef} />
      </ScrollArea>
    );
  },
);

MessageList.displayName = 'MessageList';

function EmptyMessagesState() {
  return (
    <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-border/50" />
        <div className="absolute inset-[18px] rounded-full border border-border/40" />
        <div className="absolute inset-[36px] rounded-full border border-border/30" />
        <div className="absolute inset-[54px] rounded-full border border-border/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <Search className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>

        <OrbIcon className="-left-2 top-5" icon={Trophy} />
        <OrbIcon className="right-2 top-4" icon={Medal} />
        <OrbIcon className="-left-6 bottom-8" icon={BookOpenCheck} />
        <OrbIcon className="right-1 bottom-4" icon={GraduationCap} />
        <OrbIcon className="left-10 bottom-2" icon={Pencil} />
        <OrbIcon className="right-12 bottom-12" icon={BookOpen} />
      </div>

      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">Sorry, no results!</p>
        <p className="text-sm text-muted-foreground">
          We could not find any messages yet. Start a conversation to see updates here.
        </p>
      </div>
    </div>
  );
}

function OrbIcon({
  className,
  icon: Icon,
}: {
  className: string;
  icon: typeof Search;
}) {
  return (
    <span
      className={`absolute flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm ${className}`}
    >
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
    </span>
  );
}
