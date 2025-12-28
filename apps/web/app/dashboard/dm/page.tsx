import { DirectMessagesContainer, DashboardHeader } from '@iconicedu/ui-web';
import {
  DIRECT_EDUCATOR,
  DIRECT_LAST_READ_MESSAGE_ID,
  DIRECT_MESSAGES,
  DIRECT_THREAD_MESSAGES,
  DIRECT_GUARDIAN,
} from '../../../lib/data/direct-messages';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <DirectMessagesContainer
          messages={DIRECT_MESSAGES}
          initialThreadMessages={DIRECT_THREAD_MESSAGES}
          educator={DIRECT_EDUCATOR}
          guardian={DIRECT_GUARDIAN}
          lastReadMessageId={DIRECT_LAST_READ_MESSAGE_ID}
        />
      </div>
    </>
  );
}
