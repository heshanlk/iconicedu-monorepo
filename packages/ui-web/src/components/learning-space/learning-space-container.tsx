'use client';

import { useEffect, useState } from 'react';
import { MessagesContainer } from '../messages/messages-container';
import type { MessagesContainerProps } from '../messages/messages-container';
import { LearningSpaceInfoPanel } from './learning-space-info-panel';
import { useIsMobile } from '../../hooks/use-mobile';
import type { ChannelVM } from '@iconicedu/shared-types';

export interface LearningSpaceContainerProps
  extends Omit<MessagesContainerProps, 'channel'> {
  space: ChannelVM;
}

export function LearningSpaceContainer({ space, ...props }: LearningSpaceContainerProps) {
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const members = space.participants.map((participant) => ({
    id: participant.id,
    name: participant.displayName,
    avatarUrl: participant.avatar.url ?? null,
  }));

  const nextSessionItem = space.headerItems.find((item) => item.key === 'next-session');

  return (
    <MessagesContainer
      {...props}
      channel={space}
      infoPanel={
        <LearningSpaceInfoPanel
          title={space.topic}
          topic={space.topic}
          description={space.description}
          members={members}
          schedule={null}
          nextSession={nextSessionItem?.label}
          joinUrl={undefined}
        />
      }
      infoPanelMeta={{ title: 'Details', subtitle: space.topic }}
      defaultSidebarContent={hasMounted && !isMobile ? 'space-info' : undefined}
    />
  );
}
