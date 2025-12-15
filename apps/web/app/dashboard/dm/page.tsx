import { DashboardHeader, DirectMessages, ErrorBoundary } from '@iconicedu/ui-web';

export default function Page() {
  return (
    <>
      <DashboardHeader title={'DM'} />
      <div className="h-screen w-full bg-background">
        <ErrorBoundary>
          <DirectMessages />
        </ErrorBoundary>
      </div>
    </>
  );
}
