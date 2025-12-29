'use client';

import type { MessagesContainerProps } from './messages-container';
import { MessagesShell } from './messages-shell';

export function DirectMessagesContainer(props: MessagesContainerProps) {
  return <MessagesShell {...props} />;
}
