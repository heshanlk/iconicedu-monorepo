import { DashboardHeader, InboxContainer } from '@iconicedu/ui-web';
import { INBOX_ACTIVITY_FEED } from '@iconicedu/web/lib/data/inbox-activities';

export default function Page() {
  return (
    <div className="flex min-h-0 h-screen flex-1 flex-col">
      <DashboardHeader title={'Inbox'} />
      <div className="p-4 pt-0">
        <InboxContainer feed={INBOX_ACTIVITY_FEED} />
      </div>
    </div>
  );
}
