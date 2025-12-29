'use client';

import { useEffect, useRef, memo } from 'react';
import type {
  MessagesRightPanelIntent,
  ThreadPanelPropsVM,
} from '@iconicedu/shared-types';
import { ThreadSheet } from '../thread-sheet';
import { useMessagesState } from '../messages-state-provider';
import { useIsMobile } from '../../../hooks/use-mobile';
import { MessageInput } from '../message-input';
import { ScrollArea } from '../../../ui/scroll-area';
import { ThreadMessageList } from '../shared/thread-message-list';

interface ThreadPanelProps {
  intent: MessagesRightPanelIntent;
}

const ThreadPanelContent = memo(function ThreadPanelContent({
  messages,
  onSendReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved,
  onToggleHidden,
  currentUserId,
  lastReadMessageId,
}: ThreadPanelPropsVM) {
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

export function ThreadPanel({ intent }: ThreadPanelProps) {
  const isMobile = useIsMobile();
  const {
    getThreadData,
    createTextMessage,
    appendThreadMessage,
    toggle,
    currentUserId,
    threadHandlers,
  } = useMessagesState();
  if (intent.key !== 'thread') return null;
  const threadData = getThreadData(intent.threadId);
  if (!threadData) return null;
  const onSendReply = (content: string) => {
    const message = createTextMessage?.(content);
    if (!message) return;
    appendThreadMessage(intent.threadId, message);
  };
  const onProfileClick = (userId: string) => toggle({ key: 'profile', userId });

  if (isMobile) {
    return (
      <ThreadSheet
        thread={threadData.thread}
        messages={threadData.messages}
        onSendReply={onSendReply}
        onProfileClick={onProfileClick}
        onToggleReaction={threadHandlers.onToggleReaction}
        onToggleSaved={threadHandlers.onToggleSaved}
        onToggleHidden={threadHandlers.onToggleHidden}
        currentUserId={currentUserId}
      />
    );
  }
  return (
    <ThreadPanelContent
      thread={threadData.thread}
      messages={threadData.messages}
      onSendReply={onSendReply}
      onProfileClick={onProfileClick}
      onToggleReaction={threadHandlers.onToggleReaction}
      onToggleSaved={threadHandlers.onToggleSaved}
      onToggleHidden={threadHandlers.onToggleHidden}
      currentUserId={currentUserId}
    />
  );
}
