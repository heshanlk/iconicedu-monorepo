import { Calendar, DashboardHeader } from '@iconicedu/ui-web';

export default function Page() {
  return (
    <div className="flex min-h-0 h-screen flex-1 flex-col">
      <DashboardHeader title={'Calendar'} />
      <div className="flex min-h-0 flex-1 flex-col">
        <Calendar />
      </div>
    </div>
  );
}
