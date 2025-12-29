'use client';

import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { LearningSpaceInfoPanel } from '../../learning-space/learning-space-info-panel';
import { useMessagesRightSidebar } from '../messages-right-sidebar-provider';

interface ChannelInfoPanelProps {
  intent: MessagesRightPanelIntent;
}

export function ChannelInfoPanel(_: ChannelInfoPanelProps) {
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
