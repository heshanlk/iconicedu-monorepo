import { notFound } from 'next/navigation';
import { MessagesShell, DashboardHeader } from '@iconicedu/ui-web';
import {
  DIRECT_MESSAGE_CHANNELS_BY_ID,
  DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES,
} from '../../../../../lib/data/channel-message-data';

export default function Page({ params }: { params: { channelId: string } }) {
  const channel =
    DIRECT_MESSAGE_CHANNELS_BY_ID[params.channelId] ??
    DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES.find((item) => item.dmKey === params.channelId);

  if (!channel) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-1.0rem)] flex-col">
      <DashboardHeader />
      <MessagesShell channel={channel} />
    </div>
  );
}
