import { DashboardHeader, DirectMessages, ErrorBoundary } from '@iconicedu/ui-web';

export default function Page() {
  return (
    <>
      <div className="h-screen w-full">
        <DashboardHeader />
        <ErrorBoundary>
          <DirectMessages />
        </ErrorBoundary>
      </div>
    </>
  );
}
