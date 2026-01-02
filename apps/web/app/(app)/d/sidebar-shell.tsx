'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarLeft, SidebarInset } from '@iconicedu/ui-web';
import { SIDEBAR_LEFT_DATA } from '../../../lib/data/sidebar-left';

export function SidebarShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <SidebarLeft data={SIDEBAR_LEFT_DATA} activePath={pathname} />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
