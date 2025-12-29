'use client';

import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { MessagesContainerProps } from './messages-container';
import { MessagesContainer } from './messages-container';
import { MessagesContainerHeader } from './messages-container-header';
import { ChannelHeaderActions } from './channel-header-actions';
import { RightSidebarProvider, useRightSidebar } from './right-sidebar-provider';
import { RightSidebarRegion } from './right-sidebar-region';
import { PinnedPanel } from './panels/pinned-panel';
import { SavedMessagesPanel } from './saved-messages-panel';
import { ProfilePanel as DetailedProfilePanel } from './profile-panel';
import { ProfileSheet } from './profile-sheet';
import { ThreadPanel as DetailedThreadPanel } from './thread-panel';
import { ThreadSheet } from './thread-sheet';
import { LearningSpaceInfoPanel } from '../learning-space/learning-space-info-panel';
import type { RightPanelRegistry, RightPanelIntent } from '@iconicedu/shared-types';
import { useIsMobile } from '../../hooks/use-mobile';

interface RightPanelProps {
  intent: RightPanelIntent;
}

function ChannelInfoPanelWrapper(_: RightPanelProps) {
  const { channel } = useRightSidebar();
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

function SavedPanelWrapper(_: RightPanelProps) {
  const { messages, scrollToMessage, close } = useRightSidebar();
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

function PinnedPanelWrapper(_: RightPanelProps) {
  return <PinnedPanel />;
}

function ProfilePanelWrapper({ intent }: RightPanelProps) {
  const isMobile = useIsMobile();
  const { channel, toggle } = useRightSidebar();
  if (intent.key !== 'profile') return null;
  const user = channel.participants.find((participant) => participant.id === intent.userId);
  if (isMobile) {
    return (
      <ProfileSheet
        user={user ?? null}
        onSavedMessagesClick={() => toggle({ key: 'saved' })}
      />
    );
  }
  return (
    <DetailedProfilePanel
      user={user ?? null}
      onSavedMessagesClick={() => toggle({ key: 'saved' })}
    />
  );
}

function ThreadPanelWrapper({ intent }: RightPanelProps) {
  const isMobile = useIsMobile();
  const { getThreadData, createTextMessage, appendThreadMessage, toggle, currentUserId } =
    useRightSidebar();
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

  const rightPanelRegistry = useMemo<RightPanelRegistry<ComponentType<RightPanelProps>>>(
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
    <RightSidebarProvider channel={channel}>
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <MessagesContainerHeader channel={channel} />
          <ChannelHeaderActions />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <MessagesContainer {...props} />
          <RightSidebarRegion registry={rightPanelRegistry} />
        </div>
      </div>
    </RightSidebarProvider>
  );
});
