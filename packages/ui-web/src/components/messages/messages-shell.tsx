'use client';

import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { MessagesContainerProps } from './messages-container';
import { MessagesContainer } from './messages-container';
import { MessagesContainerHeader } from './messages-container-header';
import { MessagesContainerHeaderActions } from './messages-container-header-actions';
import {
  MessagesRightSidebarProvider,
  useMessagesRightSidebar,
} from './messages-right-sidebar-provider';
import { MessagesRightSidebarRegion } from './messages-right-sidebar-region';
import { PinnedPanel } from './panels/pinned-panel';
import { SavedMessagesPanel } from './saved-messages-panel';
import { ProfilePanel as DetailedProfilePanel } from './profile-panel';
import { ProfileSheet } from './profile-sheet';
import { ThreadPanel as DetailedThreadPanel } from './thread-panel';
import { ThreadSheet } from './thread-sheet';
import { LearningSpaceInfoPanel } from '../learning-space/learning-space-info-panel';
import type {
  MessagesRightPanelRegistry,
  MessagesRightPanelIntent,
} from '@iconicedu/shared-types';
import { useIsMobile } from '../../hooks/use-mobile';

interface MessagesRightPanelProps {
  intent: MessagesRightPanelIntent;
}

function ChannelInfoPanelWrapper(_: MessagesRightPanelProps) {
  const { channel } = useMessagesRightSidebar();
  const members = channel.participants.map((participant) => ({
    id: participant.id,
    name: participant.displayName,
    role: participant.status ?? undefined,
    avatarUrl: participant.avatar.url ?? null,
  }));
  const nextSessionItem = channel.headerItems.find((item) => item.key === 'next-session');

  return (
    <LearningSpaceInfoPanel
      title={channel.topic}
      topic={channel.topic}
      description={channel.description ?? undefined}
      members={members}
      schedule={null}
      nextSession={nextSessionItem?.label}
      joinUrl={undefined}
    />
  );
}

function SavedPanelWrapper(_: MessagesRightPanelProps) {
  const { messages, scrollToMessage, close } = useMessagesRightSidebar();
  return (
    <SavedMessagesPanel
      messages={messages}
      onMessageClick={(messageId) => {
        close();
        scrollToMessage?.(messageId);
      }}
    />
  );
}

function PinnedPanelWrapper(_: MessagesRightPanelProps) {
  return <PinnedPanel />;
}

function ProfilePanelWrapper({ intent }: MessagesRightPanelProps) {
  const isMobile = useIsMobile();
  const { channel, toggle } = useMessagesRightSidebar();
  if (intent.key !== 'profile') return null;
  const user = channel.participants.find(
    (participant) => participant.id === intent.userId,
  );
  if (!user) return null;
  if (isMobile) {
    return (
      <ProfileSheet user={user} onSavedMessagesClick={() => toggle({ key: 'saved' })} />
    );
  }
  return (
    <DetailedProfilePanel
      user={user}
      onSavedMessagesClick={() => toggle({ key: 'saved' })}
    />
  );
}

function ThreadPanelWrapper({ intent }: MessagesRightPanelProps) {
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

export const MessagesShell = memo(function MessagesShell(props: MessagesContainerProps) {
  const { channel } = props;

  const rightPanelRegistry = useMemo<
    MessagesRightPanelRegistry<ComponentType<MessagesRightPanelProps>>
  >(
    () => ({
      channel_info: ChannelInfoPanelWrapper,
      saved: SavedPanelWrapper,
      pinned: PinnedPanelWrapper,
      profile: ProfilePanelWrapper,
      thread: ThreadPanelWrapper,
    }),
    [],
  );

  return (
    <MessagesRightSidebarProvider channel={channel}>
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <MessagesContainerHeader channel={channel} />
          <MessagesContainerHeaderActions />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <MessagesContainer {...props} />
          <MessagesRightSidebarRegion registry={rightPanelRegistry} />
        </div>
      </div>
    </MessagesRightSidebarProvider>
  );
});
