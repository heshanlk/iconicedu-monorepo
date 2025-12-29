'use client';

import type { ChannelVM } from '@iconicedu/shared-types';
import { MessagesShell } from './messages-shell';

export interface DirectMessagesContainerProps {
  channel: ChannelVM;
}

export function DirectMessagesContainer({ channel }: DirectMessagesContainerProps) {
  return (
    <MessagesShell
      channel={channel}
    />
  );
}
