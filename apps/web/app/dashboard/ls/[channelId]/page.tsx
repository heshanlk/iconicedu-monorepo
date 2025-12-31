import { notFound } from 'next/navigation';
import { MessagesShell, DashboardHeader } from '@iconicedu/ui-web';
import { LEARNING_SPACE_CHANNELS_BY_ID } from '../../../../lib/data/channel-message-data';
import { CLASS_SPACE_BY_CHANNEL_ID } from '../../../../lib/data/class-spaces';

export default function Page({ params }: { params: { channelId: string } }) {
  const channel = LEARNING_SPACE_CHANNELS_BY_ID[params.channelId];
  const classSpace = CLASS_SPACE_BY_CHANNEL_ID[params.channelId] ?? null;

  if (!channel) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-1.0rem)] flex-col">
      <DashboardHeader />
      <MessagesShell channel={channel} classSpace={classSpace} />
    </div>
  );
}
