'use client';

import type {
  GradeLevelOption,
  MessagesRightPanelIntent,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { ProfileContent, ProfileSheet } from '../profile-sheet';
import { useMessagesState } from '../context/messages-state-provider';
import { useIsMobile } from '../../../hooks/use-mobile';

interface ProfilePanelProps {
  intent: MessagesRightPanelIntent;
}

export function ProfilePanel({ intent }: ProfilePanelProps) {
  const isMobile = useIsMobile();
  const { channel } = useMessagesState();
  if (intent.key !== 'profile') return null;
  const user = channel.participants.find(
    (participant) => participant.id === intent.userId,
  );
  if (!user) return null;
  if (isMobile) {
    return <ProfileSheet user={user} />;
  }
  return <ProfileContent user={user} />;
}
