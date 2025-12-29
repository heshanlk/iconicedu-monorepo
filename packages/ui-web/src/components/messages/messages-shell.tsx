'use client';

import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { MessagesContainerProps } from './messages-container';
import { MessagesContainer } from './messages-container';
import { MessagesContainerHeader } from './messages-container-header';
import { ChannelHeaderActions } from './channel-header-actions';
import { RightSidebarProvider, useRightSidebar } from './right-sidebar-provider';
import { RightSidebarRegion } from './right-sidebar-region';
import { ChannelInfoPanel } from './panels/channel-info-panel';
import { PinnedPanel } from './panels/pinned-panel';
import { SavedPanel } from './panels/saved-panel';
import { ProfilePanel } from './panels/profile-panel';
import { ThreadPanel } from './panels/thread-panel';
import type { RightPanelRegistry, RightPanelIntent } from '@iconicedu/shared-types';

interface RightPanelProps {
  intent: RightPanelIntent;
}

function ChannelInfoPanelWrapper(_: RightPanelProps) {
  const { channel } = useRightSidebar();
  return <ChannelInfoPanel channel={channel} />;
}

function SavedPanelWrapper(_: RightPanelProps) {
  const { savedCount } = useRightSidebar();
  return <SavedPanel savedCount={savedCount} />;
}

function PinnedPanelWrapper(_: RightPanelProps) {
  return <PinnedPanel />;
}

function ProfilePanelWrapper({ intent }: RightPanelProps) {
  const { channel } = useRightSidebar();
  if (intent.key !== 'profile') return null;
  const user = channel.participants.find((participant) => participant.id === intent.userId);
  return <ProfilePanel user={user ?? null} />;
}

function ThreadPanelWrapper({ intent }: RightPanelProps) {
  const { getThreadData } = useRightSidebar();
  if (intent.key !== 'thread') return null;
  const threadData = getThreadData(intent.threadId);
  return <ThreadPanel threadId={intent.threadId} messages={threadData?.messages} />;
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
