import type { ReactNode } from 'react';
import { SidebarLeft, SidebarInset, SidebarProvider } from '@iconicedu/ui-web';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <main className="flex flex-1 flex-col min-h-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
