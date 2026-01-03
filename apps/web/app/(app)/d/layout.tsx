import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@iconicedu/ui-web';
import { SidebarShell } from './sidebar-shell';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/login');
  }

  return (
    <>
      <SidebarProvider>
        <SidebarShell>{children}</SidebarShell>
      </SidebarProvider>
    </>
  );
}
