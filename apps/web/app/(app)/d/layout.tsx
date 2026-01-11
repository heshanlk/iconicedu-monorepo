import type { ReactNode } from 'react';
import { SidebarProvider } from '@iconicedu/ui-web';
import { headers } from 'next/headers';

import { SidebarShell } from './sidebar-shell';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { ORG } from '../../../lib/data/org';
import { SIDEBAR_LEFT_DATA } from '../../../lib/data/sidebar-left';
import { requireAuthedUser } from '../../../lib/auth/requireAuthedUser';
import { getOrCreateAccount } from '../../../lib/accounts/getOrCreateAccount';
import { loadSidebarContext } from '../../../lib/sidebar/loadSidebarContext';

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const authUser = await requireAuthedUser(supabase);

  const { account, invite } = await getOrCreateAccount(supabase, {
    orgId: ORG.id,
    authUserId: authUser.id,
    authEmail: authUser.email ?? null,
  });

  const headerStore = await headers();
  const referer = headerStore.get('referer');
  const profileKindOverride =
    referer?.includes('/login/tutor') &&
    new URL(referer, 'http://localhost').searchParams.get('educator') === '1'
      ? 'educator'
      : undefined;

  const { sidebarData, needsNameCompletion, needsPhoneCompletion } =
    await loadSidebarContext(supabase, {
      authUser,
      account,
      familyInvite: invite,
      baseSidebarData: SIDEBAR_LEFT_DATA,
      profileKindOverride,
    });

  return (
    <SidebarProvider>
      <SidebarShell
        data={sidebarData}
        forceProfileCompletion={needsNameCompletion}
        forceAccountCompletion={!needsNameCompletion && needsPhoneCompletion}
      >
        {children}
      </SidebarShell>
    </SidebarProvider>
  );
}
