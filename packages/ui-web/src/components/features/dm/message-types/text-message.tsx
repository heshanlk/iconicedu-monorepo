import { memo } from 'react';
import type { TextMessage as TextMessageType } from '../../../../types/types';
import { MessageBase, type MessageBaseProps } from '../message-base';

interface TextMessageProps extends Omit<MessageBaseProps, 'message' | 'children'> {
  message: TextMessageType;
}

export const TextMessage = memo(function TextMessage(props: TextMessageProps) {
  const { message, ...baseProps } = props;

  return (
    <MessageBase message={message} {...baseProps}>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
        {message.content}
      </p>
    </MessageBase>
  );
});
