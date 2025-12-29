import { DirectMessagesContainer, DashboardHeader } from '@iconicedu/ui-web';
import { DIRECT_CHANNEL } from '../../../lib/data/direct-messages';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <DirectMessagesContainer channel={DIRECT_CHANNEL} />
      </div>
    </>
  );
}
