import type { ReactNode } from 'react';
import { SidebarLeft, SidebarInset, SidebarProvider } from '@iconicedu/ui-web';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
