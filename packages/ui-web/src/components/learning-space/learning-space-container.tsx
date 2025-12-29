'use client';

import { useEffect, useState } from 'react';
import { MessagesContainer } from '../messages/messages-container';
import type {
  MessagesContainerProps,
  MessagesHeaderRenderProps,
} from '../messages/messages-container';
import { MessagesContainerHeader } from '../messages/messages-container-header';
import { LearningSpaceInfoPanel } from './learning-space-info-panel';
import { useIsMobile } from '../../hooks/use-mobile';
import { Bookmark, Clock, Sparkles, BookOpen, Users } from 'lucide-react';
import type { ChannelVM } from '@iconicedu/shared-types';

export interface LearningSpaceContainerProps extends MessagesContainerProps {
  space: ChannelVM;
}

const CHANNEL_ICON_MAP: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  book: BookOpen,
  users: Users,
};

export function LearningSpaceContainer({ space, ...props }: LearningSpaceContainerProps) {
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  const renderHeader = ({
    savedCount,
    onSavedMessagesClick,
    onOpenInfo,
    isInfoActive,
  }: MessagesHeaderRenderProps) => (
    <MessagesContainerHeader
      title={space.topic}
      leading={
        space.topicIconKey && CHANNEL_ICON_MAP[space.topicIconKey] ? (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {(() => {
              const Icon = CHANNEL_ICON_MAP[space.topicIconKey!];
              return <Icon className="h-3.5 w-3.5" />;
            })()}
          </span>
        ) : undefined
      }
      subtitleItems={space.headerItems.map((item) => ({
        icon: item.key === 'saved' ? Bookmark : item.key === 'next-session' ? Clock : undefined,
        label: item.key === 'saved' ? `${savedCount}` : item.label,
        onClick: item.key === 'saved' ? onSavedMessagesClick : undefined,
        tooltip: item.tooltip ?? undefined,
      }))}
      onOpenInfo={onOpenInfo}
      isInfoActive={isInfoActive}
    />
  );

  const members = space.participants.map((participant) => ({
    id: participant.id,
    name: participant.displayName,
    avatarUrl: participant.avatar.url ?? null,
  }));

  const nextSessionItem = space.headerItems.find((item) => item.key === 'next-session');

  return (
    <MessagesContainer
      {...props}
      renderHeader={renderHeader}
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
