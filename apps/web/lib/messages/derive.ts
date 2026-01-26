import type { MessageVM } from '@iconicedu/shared-types';

export function getMessagePreview(message: MessageVM) {
  if ('content' in message && message.content && 'text' in message.content) {
    return message.content.text ?? '';
  }

  if ('attachment' in message && message.attachment?.name) {
    return message.attachment.name;
  }

  return message.core.type.replace(/-/g, ' ');
}
