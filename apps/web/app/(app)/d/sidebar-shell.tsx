'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarLeft, SidebarInset } from '@iconicedu/ui-web';
import { SIDEBAR_LEFT_DATA } from '../../../lib/data/sidebar-left';
import { createSupabaseBrowserClient } from '../../../lib/supabase/client';

export function SidebarShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  const handleLogout = React.useCallback(async () => {
    await supabase.auth.signOut();
    window.location.assign('/login');
  }, [supabase]);

  return (
    <>
      <SidebarLeft
        data={SIDEBAR_LEFT_DATA}
        activePath={pathname}
        onLogout={handleLogout}
      />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
