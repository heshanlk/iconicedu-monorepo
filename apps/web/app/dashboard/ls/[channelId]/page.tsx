import { notFound } from 'next/navigation';
import { DashboardHeader } from '@iconicedu/ui-web';
import { LEARNING_SPACE_CHANNELS_BY_ID } from '../../../../lib/data/channel-message-data';
import { LEARNING_SPACE_BY_CHANNEL_ID } from '../../../../lib/data/learning-spaces';
import { LearningSpaceShell } from './learning-space-shell';

export default function Page({ params }: { params: { channelId: string } }) {
  const channel = LEARNING_SPACE_CHANNELS_BY_ID[params.channelId];
  const learningSpace = LEARNING_SPACE_BY_CHANNEL_ID[params.channelId] ?? null;

  if (!channel) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-1.0rem)] flex-col">
      <DashboardHeader />
      <LearningSpaceShell
        channel={channel}
        learningSpace={learningSpace}
      />
    </div>
  );
}
