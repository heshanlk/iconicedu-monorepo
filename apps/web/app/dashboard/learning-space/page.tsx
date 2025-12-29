import { LearningSpaceContainer, DashboardHeader } from '@iconicedu/ui-web';
import {
  LAST_READ_MESSAGE_ID,
  LEARNING_SPACE,
} from '../../../lib/data/learning-space-messages';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.5rem)] flex-col">
        <DashboardHeader />
        <LearningSpaceContainer
          space={LEARNING_SPACE}
          lastReadMessageId={LAST_READ_MESSAGE_ID}
        />
      </div>
    </>
  );
}
