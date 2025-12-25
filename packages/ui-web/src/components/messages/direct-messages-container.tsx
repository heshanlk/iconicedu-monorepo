'use client';

import { MessagesContainer } from './messages-container';
import type { MessagesContainerProps } from './messages-container';

export function DirectMessagesContainer(props: MessagesContainerProps) {
  return <MessagesContainer {...props} />;
}
