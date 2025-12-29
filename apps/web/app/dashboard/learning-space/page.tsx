import { MessagesShell, DashboardHeader } from '@iconicedu/ui-web';
import { LEARNING_SPACE } from '../../../lib/data/learning-space-messages';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <MessagesShell channel={LEARNING_SPACE} />
      </div>
    </>
  );
}
