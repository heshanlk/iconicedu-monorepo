'use client';

import { useEffect, useMemo, useRef, memo } from 'react';
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
  replies,
  parentMessage,
  onSendReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved,
  onToggleHidden,
  currentUserId,
  readState,
}: ThreadPanelPropsVM) {
  const messages = parentMessage ? [parentMessage, ...replies.items] : replies.items;
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
          lastReadMessageId={readState?.lastReadMessageId}
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
    messages,
  } = useMessagesState();
  if (intent.key !== 'thread') return null;
  const threadData = getThreadData(intent.threadId);
  if (!threadData) return null;
  const parentMessage =
    threadData.parentMessage ??
    messages.find((message) => message.id === threadData.thread.parentMessageId);
  const threadMessages = useMemo(
    () =>
      messages.filter((message) => message.thread?.id === threadData.thread.id),
    [messages, threadData.thread.id],
  );
  const sortedThreadMessages = useMemo(() => {
    const messageMap = new Map<string, typeof messages[number]>();
    if (parentMessage) {
      messageMap.set(parentMessage.id, parentMessage);
    }
    threadMessages.forEach((message) => messageMap.set(message.id, message));
    return Array.from(messageMap.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [parentMessage, threadMessages]);
  const replies = useMemo(() => {
    const replyItems = sortedThreadMessages.filter(
      (message) => message.id !== parentMessage?.id,
    );
    return {
      items: replyItems,
      total: replyItems.length,
    };
  }, [parentMessage?.id, sortedThreadMessages]);

  const onSendReply = (content: string) => {
    const message = createTextMessage?.(content);
    if (!message) return;
    const updatedThread = {
      ...threadData.thread,
      messageCount: threadData.thread.messageCount + 1,
      lastReplyAt: new Date().toISOString(),
    };
    const messageWithThread = {
      ...message,
      thread: updatedThread,
    };
    threadHandlers.onAddMessage?.(messageWithThread);
    threadHandlers.onUpdateMessage?.(threadData.thread.parentMessageId, {
      thread: updatedThread,
    });
    appendThreadMessage(intent.threadId, messageWithThread);
  };
  const onProfileClick = (userId: string) => toggle({ key: 'profile', userId });

  if (isMobile) {
    return (
      <ThreadSheet
        thread={threadData.thread}
        replies={replies}
        parentMessage={parentMessage}
        onSendReply={onSendReply}
        onProfileClick={onProfileClick}
        onToggleReaction={threadHandlers.onToggleReaction}
        onToggleSaved={threadHandlers.onToggleSaved}
        onToggleHidden={threadHandlers.onToggleHidden}
        currentUserId={currentUserId}
        readState={threadData.thread.readState}
      />
    );
  }
  return (
    <ThreadPanelContent
      thread={threadData.thread}
      replies={replies}
      parentMessage={parentMessage}
      onSendReply={onSendReply}
      onProfileClick={onProfileClick}
      onToggleReaction={threadHandlers.onToggleReaction}
      onToggleSaved={threadHandlers.onToggleSaved}
      onToggleHidden={threadHandlers.onToggleHidden}
      currentUserId={currentUserId}
      readState={threadData.thread.readState}
    />
  );
}
