'use client';

import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { ThreadPanel as DetailedThreadPanel } from '../thread-panel';
import { ThreadSheet } from '../thread-sheet';
import { useMessagesRightSidebar } from '../messages-right-sidebar-provider';
import { useIsMobile } from '../../../hooks/use-mobile';

interface ThreadPanelProps {
  intent: MessagesRightPanelIntent;
}

export function ThreadPanel({ intent }: ThreadPanelProps) {
  const isMobile = useIsMobile();
  const { getThreadData, createTextMessage, appendThreadMessage, toggle, currentUserId } =
    useMessagesRightSidebar();
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
        currentUserId={currentUserId}
      />
    );
  }
  return (
    <DetailedThreadPanel
      thread={threadData.thread}
      messages={threadData.messages}
      onSendReply={onSendReply}
      onProfileClick={onProfileClick}
      currentUserId={currentUserId}
    />
  );
}
