'use client';

import { useEffect, useMemo, useRef, memo } from 'react';
import type {
  MessagesRightPanelIntent,
  ThreadPanelPropsVM,
} from '@iconicedu/shared-types';
import { ThreadSheet } from '@iconicedu/ui-web/components/messages/thread-sheet';
import { useMessagesState } from '@iconicedu/ui-web/components/messages/context/messages-state-provider';
import { useIsMobile } from '@iconicedu/ui-web/hooks/use-mobile';
import { MessageInput } from '@iconicedu/ui-web/components/messages/message-input';
import { ScrollArea } from '@iconicedu/ui-web/ui/scroll-area';
import { ThreadMessageList } from '@iconicedu/ui-web/components/messages/shared/thread-message-list';

interface ThreadPanelProps {
  intent: MessagesRightPanelIntent;
}

const ThreadPanelContent = memo(function ThreadPanelContent({
  replies,
  parentMessage,
  actions,
  currentUserId,
  readState,
}: ThreadPanelPropsVM) {
  const {
    onSendReply,
    onProfileClick,
    onToggleReaction,
    onToggleSaved,
    onToggleHidden,
  } = actions;
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
    messages.find(
      (message) => message.ids.id === threadData.thread.parent.messageId,
    );
  const threadMessages = useMemo(
    () =>
      messages.filter(
        (message) => message.social.thread?.ids.id === threadData.thread.ids.id,
      ),
    [messages, threadData.thread.ids.id],
  );
  const sortedThreadMessages = useMemo(() => {
    const messageMap = new Map<string, (typeof messages)[number]>();
    if (parentMessage) {
      messageMap.set(parentMessage.ids.id, parentMessage);
    }
    threadMessages.forEach((message) => messageMap.set(message.ids.id, message));
    return Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.core.createdAt).getTime() - new Date(b.core.createdAt).getTime(),
    );
  }, [parentMessage, threadMessages]);
  const replies = useMemo(() => {
    const replyItems = sortedThreadMessages.filter(
      (message) => message.ids.id !== parentMessage?.ids.id,
    );
    return {
      items: replyItems,
      total: replyItems.length,
    };
  }, [parentMessage?.ids.id, sortedThreadMessages]);

  const onSendReply = (content: string) => {
    const message = createTextMessage?.(content);
    if (!message) return;
    const updatedThread = {
      ...threadData.thread,
      stats: {
        ...threadData.thread.stats,
        messageCount: threadData.thread.stats.messageCount + 1,
        lastReplyAt: new Date().toISOString(),
      },
    };
    const messageWithThread = {
      ...message,
      social: {
        ...message.social,
        thread: updatedThread,
      },
    };
    threadHandlers.onAddMessage?.(messageWithThread);
    threadHandlers.onUpdateMessage?.(threadData.thread.parent.messageId, {
      social: {
        ...(parentMessage?.social ?? { reactions: [] }),
        thread: updatedThread,
      },
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
        actions={{
          onSendReply,
          onProfileClick,
          onToggleReaction: threadHandlers.onToggleReaction,
          onToggleSaved: threadHandlers.onToggleSaved,
          onToggleHidden: threadHandlers.onToggleHidden,
        }}
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
      actions={{
        onSendReply,
        onProfileClick,
        onToggleReaction: threadHandlers.onToggleReaction,
        onToggleSaved: threadHandlers.onToggleSaved,
        onToggleHidden: threadHandlers.onToggleHidden,
      }}
      currentUserId={currentUserId}
      readState={threadData.thread.readState}
    />
  );
}
