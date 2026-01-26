import { notFound } from 'next/navigation';
import { DashboardHeader, MessagesShell } from '@iconicedu/ui-web';
import { SUPPORT_CHANNEL } from '@iconicedu/web/lib/data/support-channel';

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const channel = channelId === SUPPORT_CHANNEL.ids.id ? SUPPORT_CHANNEL : null;

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
