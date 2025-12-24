import { DashboardHeader, DirectMessages, ErrorBoundary } from '@iconicedu/ui-web';

export default function Page() {
  return (
    <>
      <div className="flex h-[calc(100vh-1.0rem)] flex-col">
        <DashboardHeader />
        <ErrorBoundary>
          <DirectMessages />
        </ErrorBoundary>
      </div>
    </>
  );
}
