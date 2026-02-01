'use client';

import type { ChannelVM, LearningSpaceVM } from '@iconicedu/shared-types';
import { MessagesShell, LearningSpaceInfoPanel } from '@iconicedu/ui-web';

export function LearningSpaceShell({
  channel,
  learningSpace,
  currentUserId,
}: {
  channel: ChannelVM;
  learningSpace: LearningSpaceVM | null;
  currentUserId?: string;
}) {
  return (
    <MessagesShell
      channel={channel}
      currentUserId={currentUserId}
      panelRegistry={{
        channel_info: (props) => (
          <LearningSpaceInfoPanel {...props} learningSpace={learningSpace} />
        ),
      }}
    />
  );
}
