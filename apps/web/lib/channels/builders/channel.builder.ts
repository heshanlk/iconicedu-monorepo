import type { ChannelVM } from '@iconicedu/shared-types';

import {
  DIRECT_MESSAGE_CHANNELS_BY_ID,
  DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES,
  LEARNING_SPACE_CHANNELS_BY_ID,
  LEARNING_SPACE_CHANNELS_WITH_MESSAGES,
  SUPPORT_CHANNEL,
} from '@iconicedu/web/lib/data/channel-message-data';

const CHANNELS_BY_ID: Record<string, ChannelVM> = {
  ...LEARNING_SPACE_CHANNELS_BY_ID,
  ...DIRECT_MESSAGE_CHANNELS_BY_ID,
  [SUPPORT_CHANNEL.ids.id]: SUPPORT_CHANNEL,
};

export function getLearningSpaceChannelsWithMessages(): ChannelVM[] {
  return LEARNING_SPACE_CHANNELS_WITH_MESSAGES;
}

export function getDirectMessageChannelsWithMessages(): ChannelVM[] {
  return DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES;
}

export function getSupportChannel(): ChannelVM {
  return SUPPORT_CHANNEL;
}

export function getChannelById(channelId: string): ChannelVM | null {
  return CHANNELS_BY_ID[channelId] ?? null;
}

export function getAllChannels(): ChannelVM[] {
  return [
    ...LEARNING_SPACE_CHANNELS_WITH_MESSAGES,
    ...DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES,
    SUPPORT_CHANNEL,
  ];
}
