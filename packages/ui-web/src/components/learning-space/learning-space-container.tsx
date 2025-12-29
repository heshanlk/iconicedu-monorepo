'use client';

import { MessagesShell } from '../messages/messages-shell';
import type { MessagesContainerProps } from '../messages/messages-container';
import type { ChannelVM } from '@iconicedu/shared-types';

export interface LearningSpaceContainerProps
  extends Omit<MessagesContainerProps, 'channel'> {
  space: ChannelVM;
}

export function LearningSpaceContainer({ space, ...props }: LearningSpaceContainerProps) {
  return (
    <MessagesShell
      {...props}
      channel={space}
    />
  );
}
