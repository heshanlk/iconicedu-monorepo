import type { ReactNode } from 'react';
import { SidebarLeft, SidebarInset, SidebarProvider } from '@iconicedu/ui-web';
import { SIDEBAR_LEFT_DATA } from '../../lib/data/sidebar-left';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <SidebarLeft data={SIDEBAR_LEFT_DATA} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
