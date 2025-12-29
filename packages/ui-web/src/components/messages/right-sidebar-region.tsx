'use client';

import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { RightPanelIntent, RightPanelRegistry } from '@iconicedu/shared-types';
import { MessagesSidebar } from './messages-sidebar';
import { useRightSidebar } from './right-sidebar-provider';
interface RightSidebarRegionProps {
  registry: RightPanelRegistry<ComponentType<RightPanelProps>>;
}

interface RightPanelProps {
  intent: RightPanelIntent;
}

const getSidebarMeta = (intent: RightPanelIntent | null) => {
  if (!intent) return { title: '', subtitle: undefined };
  switch (intent.key) {
    case 'channel_info':
      return { title: 'Details', subtitle: undefined };
    case 'saved':
      return { title: 'Saved Messages', subtitle: undefined };
    case 'pinned':
      return { title: 'Pinned', subtitle: undefined };
    case 'profile':
      return { title: 'Profile', subtitle: undefined };
    case 'thread':
      return { title: 'Thread', subtitle: undefined };
    default:
      return { title: '', subtitle: undefined };
  }
};

export const RightSidebarRegion = memo(function RightSidebarRegion({
  registry,
}: RightSidebarRegionProps) {
  const { state, close } = useRightSidebar();

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
