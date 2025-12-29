import { DirectMessagesContainer, DashboardHeader } from '@iconicedu/ui-web';
import {
  DIRECT_CHANNEL,
  DIRECT_READ_STATE,
} from '../../../lib/data/direct-messages';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <DirectMessagesContainer
          channel={DIRECT_CHANNEL}
          readState={DIRECT_READ_STATE}
        />
      </div>
    </>
  );
}
