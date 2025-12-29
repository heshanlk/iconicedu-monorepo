'use client';

import type { MessagesContainerProps } from './messages-container';
import type { ChannelVM } from '@iconicedu/shared-types';
import { MessagesShell } from './messages-shell';

export interface DirectMessagesContainerProps
  extends Omit<MessagesContainerProps, 'channel'> {
  channel: ChannelVM;
}

export function DirectMessagesContainer({ channel, ...props }: DirectMessagesContainerProps) {
  return (
    <MessagesShell
      {...props}
      channel={channel}
    />
  );
}
