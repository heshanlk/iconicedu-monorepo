import { LearningSpaceContainer, DashboardHeader } from '@iconicedu/ui-web';
import {
  LAST_READ_MESSAGE_ID,
  LEARNING_SPACE,
  MOCK_MESSAGES,
  MOCK_THREAD_MESSAGES,
} from '../../../lib/data/learning-space-messages';
import {
  MOCK_GUARDIAN,
  MOCK_EDUCATOR,
  getMockUserAccountById,
  toProfileUser,
} from '../../../lib/data/people';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <LearningSpaceContainer
          messages={MOCK_MESSAGES}
          initialThreadMessages={MOCK_THREAD_MESSAGES}
          space={LEARNING_SPACE}
          educator={toProfileUser(
            MOCK_EDUCATOR,
            getMockUserAccountById(MOCK_EDUCATOR.accountId),
          )}
          guardian={toProfileUser(
            MOCK_GUARDIAN,
            getMockUserAccountById(MOCK_GUARDIAN.accountId),
          )}
          lastReadMessageId={LAST_READ_MESSAGE_ID}
        />
      </div>
    </>
  );
}
