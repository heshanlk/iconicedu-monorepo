import { ClassroomContainer, DashboardHeader } from '@iconicedu/ui-web';
import {
  LAST_READ_MESSAGE_ID,
  MOCK_MESSAGES,
  MOCK_THREAD_MESSAGES,
} from '../../../lib/data/classroom-messages';
import { MOCK_PARENT, MOCK_TEACHER, toProfileUser } from '../../../lib/data/people';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <ClassroomContainer
          messages={MOCK_MESSAGES}
          initialThreadMessages={MOCK_THREAD_MESSAGES}
          teacher={toProfileUser(MOCK_TEACHER)}
          parent={toProfileUser(MOCK_PARENT)}
          lastReadMessageId={LAST_READ_MESSAGE_ID}
        />
      </div>
    </>
  );
}
