'use client';

import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { ProfilePanel as DetailedProfilePanel } from '../profile-panel';
import { ProfileSheet } from '../profile-sheet';
import { useMessagesState } from '../messages-state-provider';
import { useIsMobile } from '../../../hooks/use-mobile';

interface ProfilePanelProps {
  intent: MessagesRightPanelIntent;
}

export function ProfilePanel({ intent }: ProfilePanelProps) {
  const isMobile = useIsMobile();
  const { channel, toggle } = useMessagesState();
  if (intent.key !== 'profile') return null;
  const user = channel.participants.find(
    (participant) => participant.id === intent.userId,
  );
  if (!user) return null;
  if (isMobile) {
    return (
      <ProfileSheet user={user} onSavedMessagesClick={() => toggle({ key: 'saved' })} />
    );
  }
  return (
    <DetailedProfilePanel user={user} onSavedMessagesClick={() => toggle({ key: 'saved' })} />
  );
}
