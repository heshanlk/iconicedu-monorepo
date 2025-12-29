'use client';

import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type {
  MessagesRightPanelIntent,
  MessagesRightPanelRegistry,
} from '@iconicedu/shared-types';
import { MessagesSidebar } from './messages-sidebar';
import { useMessagesRightSidebar } from './messages-right-sidebar-provider';
interface MessagesRightSidebarRegionProps {
  registry: MessagesRightPanelRegistry<ComponentType<MessagesRightPanelProps>>;
}

interface MessagesRightPanelProps {
  intent: MessagesRightPanelIntent;
}

const getSidebarMeta = (intent: MessagesRightPanelIntent | null) => {
  if (!intent) return { title: '', subtitle: undefined };
  switch (intent.key) {
    case 'channel_info':
      return { title: 'Details', subtitle: undefined };
    case 'saved':
      return { title: 'Saved Messages', subtitle: undefined };
    case 'profile':
      return { title: 'Profile', subtitle: undefined };
    case 'thread':
      return { title: 'Thread', subtitle: undefined };
    default:
      return { title: '', subtitle: undefined };
  }
};

export const MessagesRightSidebarRegion = memo(function MessagesRightSidebarRegion({
  registry,
}: MessagesRightSidebarRegionProps) {
  const { state, close } = useMessagesRightSidebar();

  const Panel = useMemo(() => {
    if (!state.intent) return null;
    return registry[state.intent.key];
  }, [registry, state.intent]);

  const meta = getSidebarMeta(state.intent);

  return (
    <MessagesSidebar open={state.isOpen} title={meta.title} subtitle={meta.subtitle} onClose={close}>
      {Panel && state.intent ? <Panel intent={state.intent} /> : null}
    </MessagesSidebar>
  );
});
