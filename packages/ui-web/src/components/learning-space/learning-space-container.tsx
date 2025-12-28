'use client';

import { MessagesContainer } from '../messages/messages-container';
import type {
  MessagesContainerProps,
  MessagesHeaderRenderProps,
} from '../messages/messages-container';
import { LearningSpaceHeader } from './learning-space-header';
import { LearningSpaceInfoPanel } from './learning-space-info-panel';

interface LearningSpaceMember {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface LearningSpaceMeta {
  title: string;
  schedule: string;
  nextSession: string;
  topic?: string;
  description?: string;
  joinUrl?: string;
  members: LearningSpaceMember[];
  accentColor?: string;
}

export interface LearningSpaceContainerProps extends MessagesContainerProps {
  space: LearningSpaceMeta;
}

export function LearningSpaceContainer({
  space,
  ...props
}: LearningSpaceContainerProps) {
  const renderHeader = ({
    savedCount,
    onSavedMessagesClick,
    onOpenInfo,
  }: MessagesHeaderRenderProps) => (
    <LearningSpaceHeader
      title={space.title}
      schedule={space.schedule}
      nextSession={space.nextSession}
      savedCount={savedCount}
      onSavedMessagesClick={onSavedMessagesClick}
      onOpenInfo={onOpenInfo}
      joinUrl={space.joinUrl}
      accentColor={space.accentColor}
    />
  );

  return (
    <MessagesContainer
      {...props}
      renderHeader={renderHeader}
      infoPanel={
        <LearningSpaceInfoPanel
          title={space.title}
          topic={space.topic}
          description={space.description}
          members={space.members}
          schedule={space.schedule}
          nextSession={space.nextSession}
        />
      }
      infoPanelMeta={{ title: 'Details', subtitle: space.title }}
    />
  );
}
