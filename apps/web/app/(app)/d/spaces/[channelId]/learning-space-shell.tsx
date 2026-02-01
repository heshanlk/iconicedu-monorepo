'use client';

import type { ChannelVM, LearningSpaceVM, UserProfileVM } from '@iconicedu/shared-types';
import { MessagesShell, LearningSpaceInfoPanel } from '@iconicedu/ui-web';

export function LearningSpaceShell({
  channel,
  learningSpace,
  currentUserId,
  currentUserProfile,
}: {
  channel: ChannelVM;
  learningSpace: LearningSpaceVM | null;
  currentUserId?: string;
  currentUserProfile?: UserProfileVM | null;
}) {
  return (
    <MessagesShell
      channel={channel}
      currentUserId={currentUserId}
      currentUserProfile={currentUserProfile}
      panelRegistry={{
        channel_info: (props) => (
          <LearningSpaceInfoPanel {...props} learningSpace={learningSpace} />
        ),
      }}
    />
  );
}
