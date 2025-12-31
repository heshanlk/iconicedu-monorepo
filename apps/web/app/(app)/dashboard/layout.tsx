import type { ReactNode } from 'react';
import { SidebarProvider } from '@iconicedu/ui-web';
import { SidebarShell } from '../sidebar-shell';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <SidebarShell>{children}</SidebarShell>
      </SidebarProvider>
    </>
  );
}
