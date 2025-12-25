import { ClassroomContainer, DashboardHeader } from '@iconicedu/ui-web';
import {
  LAST_READ_MESSAGE_ID,
  MOCK_MESSAGES,
  MOCK_PARENT,
  MOCK_TEACHER,
  MOCK_THREAD_MESSAGES,
} from '../../../lib/data/classroom-messages';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <ClassroomContainer
          messages={MOCK_MESSAGES}
          initialThreadMessages={MOCK_THREAD_MESSAGES}
          teacher={MOCK_TEACHER}
          parent={MOCK_PARENT}
          lastReadMessageId={LAST_READ_MESSAGE_ID}
        />
      </div>
    </>
  );
}
