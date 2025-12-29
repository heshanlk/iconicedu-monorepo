import { LearningSpaceContainer, DashboardHeader } from '@iconicedu/ui-web';
import {
  LEARNING_SPACE_READ_STATE,
  LEARNING_SPACE,
} from '../../../lib/data/learning-space-messages';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <LearningSpaceContainer
          space={LEARNING_SPACE}
          readState={LEARNING_SPACE_READ_STATE}
        />
      </div>
    </>
  );
}
