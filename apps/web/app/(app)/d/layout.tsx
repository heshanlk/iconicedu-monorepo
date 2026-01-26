import type { ReactNode } from 'react';
import { SidebarProvider } from '@iconicedu/ui-web';
import { cookies, headers } from 'next/headers';

import { SidebarShell } from '@iconicedu/web/app/(app)/d/sidebar-shell';
import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { ORG } from '@iconicedu/web/lib/data/org';
import { SIDEBAR_LEFT_DATA } from '@iconicedu/web/lib/data/sidebar-left';
import { ADMIN_MENU_SECTIONS } from '@iconicedu/web/lib/data/admin-menu-sections';
import { requireAuthedUser } from '@iconicedu/web/lib/auth/requireAuthedUser';
import { getOrCreateAccount } from '@iconicedu/web/lib/accounts/getOrCreateAccount';
import { loadSidebarContext } from '@iconicedu/web/lib/sidebar/loadSidebarContext';

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
  const cookieStore = await cookies();
  const overrideCookie = cookieStore.get('profile_kind_override');
  const profileKindOverrideFromCookie =
    overrideCookie?.value === 'educator' ? 'educator' : undefined;
  const profileKindOverrideFromReferer =
    referer?.includes('/login/tutor') &&
    new URL(referer, 'http://localhost').searchParams.get('educator') === '1'
      ? 'educator'
      : undefined;
  const profileKindOverride = profileKindOverrideFromCookie ?? profileKindOverrideFromReferer;

  const { sidebarData, onboardingStatus } = await loadSidebarContext(supabase, {
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
        initialOnboardingStatus={onboardingStatus}
        adminSections={ADMIN_MENU_SECTIONS}
      >
        {children}
      </SidebarShell>
    </SidebarProvider>
  );
}
