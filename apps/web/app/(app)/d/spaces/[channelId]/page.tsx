import { notFound } from 'next/navigation';
import { DashboardHeader } from '@iconicedu/ui-web';
import { LEARNING_SPACE_CHANNELS_BY_ID } from '@iconicedu/web/lib/data/channel-message-data';
import { LEARNING_SPACE_BY_CHANNEL_ID } from '@iconicedu/web/lib/data/learning-spaces';
import { LearningSpaceShell } from './learning-space-shell';

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const channel = LEARNING_SPACE_CHANNELS_BY_ID[channelId];
  const learningSpace = LEARNING_SPACE_BY_CHANNEL_ID[channelId] ?? null;

  if (!channel) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-1.0rem)] flex-col">
      <DashboardHeader />
      <LearningSpaceShell channel={channel} learningSpace={learningSpace} />
    </div>
  );
}
