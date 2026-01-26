import type {
  ChannelFileItemVM,
  ChannelMediaItemVM,
  MessageVM,
} from '@iconicedu/shared-types';

import { getChannelById } from '@iconicedu/web/lib/channels/builders/channel.builder';

export function getChannelMessages(channelId: string): MessageVM[] {
  const channel = getChannelById(channelId);
  return channel?.collections.messages.items ?? [];
}

export function getChannelMedia(channelId: string): ChannelMediaItemVM[] {
  const channel = getChannelById(channelId);
  return channel?.collections.media.items ?? [];
}

export function getChannelFiles(channelId: string): ChannelFileItemVM[] {
  const channel = getChannelById(channelId);
  return channel?.collections.files.items ?? [];
}
