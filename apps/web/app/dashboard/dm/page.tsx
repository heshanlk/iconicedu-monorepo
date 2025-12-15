import { DashboardHeader, DirectMessages, ErrorBoundary } from '@iconicedu/ui-web';

export default function Page() {
  return (
    <>
      <DashboardHeader />
      <div className="h-screen w-full bg-background">
        <ErrorBoundary>
          <DirectMessages />
        </ErrorBoundary>
      </div>
    </>
  );
}
