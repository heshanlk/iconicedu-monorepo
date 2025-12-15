'use client';

import { memo } from 'react';
import type { ImageMessage as ImageMessageType } from '../../../../types/types';
import { MessageBase, type MessageBaseProps } from '../message-base';

interface ImageMessageProps extends Omit<MessageBaseProps, 'message' | 'children'> {
  message: ImageMessageType;
}

export const ImageMessage = memo(function ImageMessage(props: ImageMessageProps) {
  const { message, ...baseProps } = props;

  return (
    <MessageBase message={message} {...baseProps}>
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="overflow-hidden rounded-lg border border-border max-w-sm">
        <img
          src={message.attachment.url || '/placeholder.svg'}
          alt={message.attachment.name}
          className="w-full h-auto"
        />
      </div>
    </MessageBase>
  );
});
