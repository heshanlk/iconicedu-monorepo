'use client';

import type { ChannelVM, LearningSpaceVM } from '@iconicedu/shared-types';
import { MessagesShell, LearningSpaceInfoPanel } from '@iconicedu/ui-web';

export function LearningSpaceShell({
  channel,
  learningSpace,
}: {
  channel: ChannelVM;
  learningSpace: LearningSpaceVM | null;
}) {
  return (
    <MessagesShell
      channel={channel}
      panelRegistry={{
        channel_info: (props) => (
          <LearningSpaceInfoPanel {...props} learningSpace={learningSpace} />
        ),
      }}
    />
  );
}
