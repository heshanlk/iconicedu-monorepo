'use client';

import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { MessagesContainerProps } from './messages-container';
import { MessagesContainer } from './messages-container';
import { MessagesContainerHeader } from './messages-container-header';
import { MessagesContainerHeaderActions } from './messages-container-header-actions';
import { MessagesStateProvider, useMessagesState } from './messages-state-provider';
import { MessagesRightSidebarRegion } from './messages-right-sidebar-region';
import { ChannelInfoPanel } from './panels/channel-info-panel';
import { ProfilePanel } from './panels/profile-panel';
import { SavedPanel } from './panels/saved-panel';
import { ThreadPanel } from './panels/thread-panel';
import type {
  MessagesRightPanelRegistry,
  MessagesRightPanelIntent,
} from '@iconicedu/shared-types';
import { useIsMobile } from '../../hooks/use-mobile';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../ui/resizable';

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
    <MessagesStateProvider channel={channel}>
      <MessagesShellLayout {...props} registry={rightPanelRegistry} />
    </MessagesStateProvider>
  );
});

interface MessagesShellLayoutProps extends MessagesContainerProps {
  registry: MessagesRightPanelRegistry<ComponentType<MessagesRightPanelProps>>;
}

const MessagesShellLayout = memo(function MessagesShellLayout({
  registry,
  ...props
}: MessagesShellLayoutProps) {
  const isMobile = useIsMobile();
  const { state } = useMessagesState();

  const mainContent = (
    <div className="flex min-h-0 flex-1 min-w-0 flex-col">
      <MessagesContainer {...props} />
    </div>
  );

  const rightPanel = (
    <MessagesRightSidebarRegion registry={registry} layout="resizable" />
  );

  if (isMobile) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <MessagesContainerHeader channel={props.channel} />
          <MessagesContainerHeaderActions />
        </header>
        <div className="flex flex-1 overflow-hidden">
          {mainContent}
          <MessagesRightSidebarRegion registry={registry} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <MessagesContainerHeader channel={props.channel} />
        <MessagesContainerHeaderActions />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0 min-h-0">
          <ResizablePanel
            defaultSize={state.isOpen ? 60 : 100}
            minSize={50}
            className="min-w-0 min-h-0 flex flex-col"
          >
            {mainContent}
          </ResizablePanel>
          {state.isOpen ? (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={40}
                minSize={30}
                maxSize={45}
                className="min-w-0 min-h-0 flex flex-col"
              >
                {rightPanel}
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </div>
    </div>
  );
});
