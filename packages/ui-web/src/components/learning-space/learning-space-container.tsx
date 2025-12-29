'use client';

import { MessagesShell } from '../messages/messages-shell';
import type { ChannelVM } from '@iconicedu/shared-types';

export interface LearningSpaceContainerProps {
  space: ChannelVM;
}

export function LearningSpaceContainer({ space }: LearningSpaceContainerProps) {
  return <MessagesShell channel={space} />;
}
