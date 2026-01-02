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
  const user = channel.collections.participants.find(
    (participant) => participant.ids.id === intent.userId,
  );
  if (!user) return null;
  const handleDmClick =
    channel.basics.kind === 'dm'
      ? () => {
          if (typeof window !== 'undefined') {
            window.location.href = `/dm/${channel.ids.id}`;
          }
        }
      : undefined;
  if (isMobile) {
    return (
      <ProfileSheet
        user={user}
        media={channel.collections.media.items}
        files={channel.collections.files.items}
        onDmClick={handleDmClick}
      />
    );
  }
  return (
    <ProfileContent
      user={user}
      media={channel.collections.media.items}
      files={channel.collections.files.items}
      onDmClick={handleDmClick}
    />
  );
}
