'use client';

import { MessagesContainer } from '../messages/messages-container';
import type { MessagesContainerProps } from '../messages/messages-container';

export function ClassroomContainer(props: MessagesContainerProps) {
  return <MessagesContainer {...props} />;
}
