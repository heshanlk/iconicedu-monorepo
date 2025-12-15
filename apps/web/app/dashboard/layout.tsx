import type { ReactNode } from 'react';
import { SidebarLeft, SidebarInset, SidebarProvider } from '@iconicedu/ui-web';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
