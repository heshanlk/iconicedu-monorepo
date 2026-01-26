import type { ChannelMiniVM, ChannelVM } from '@iconicedu/shared-types';

export function resolveChannelTitle(
  channel: Pick<ChannelVM, 'basics'> | Pick<ChannelMiniVM, 'basics'>,
) {
  return channel.basics.topic;
}
