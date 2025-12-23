import { DashboardHeader, DirectMessages, ErrorBoundary } from '@iconicedu/ui-web';

export default function Page() {
  return (
    <>
      <div className="flex min-h-0 h-screen flex-col">
        <DashboardHeader />
        <ErrorBoundary>
          <DirectMessages />
        </ErrorBoundary>
      </div>
    </>
  );
}
