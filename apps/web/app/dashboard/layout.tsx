import type { ReactNode } from 'react';
import {
  SidebarLeft,
  SidebarInset,
  SidebarProvider,
  DashboardHeader,
} from '@iconicedu/ui-web';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
