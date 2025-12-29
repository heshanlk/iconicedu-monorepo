'use client';

import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { MessagesContainerProps } from './messages-container';
import { MessagesContainer } from './messages-container';
import { MessagesContainerHeader } from './messages-container-header';
import { MessagesContainerHeaderActions } from './messages-container-header-actions';
import { MessagesRightSidebarProvider } from './messages-right-sidebar-provider';
import { MessagesRightSidebarRegion } from './messages-right-sidebar-region';
import { ChannelInfoPanel } from './panels/channel-info-panel';
import { ProfilePanel } from './panels/profile-panel';
import { SavedPanel } from './panels/saved-panel';
import { ThreadPanel } from './panels/thread-panel';
import type {
  MessagesRightPanelRegistry,
  MessagesRightPanelIntent,
} from '@iconicedu/shared-types';

interface MessagesRightPanelProps {
  intent: MessagesRightPanelIntent;
}

export const MessagesShell = memo(function MessagesShell(props: MessagesContainerProps) {
  const { channel } = props;

  const rightPanelRegistry = useMemo<
    MessagesRightPanelRegistry<ComponentType<MessagesRightPanelProps>>
  >(
    () => ({
      channel_info: ChannelInfoPanel,
      saved: SavedPanel,
      profile: ProfilePanel,
      thread: ThreadPanel,
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
