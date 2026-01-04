'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { SidebarLeftDataVM } from '@iconicedu/shared-types';
import { SidebarLeft, SidebarInset } from '@iconicedu/ui-web';
import { createSupabaseBrowserClient } from '../../../lib/supabase/client';

export function SidebarShell({
  children,
  data,
  forceProfileCompletion,
}: {
  children: ReactNode;
  data: SidebarLeftDataVM;
  forceProfileCompletion?: boolean;
}) {
  const pathname = usePathname();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const [sidebarData, setSidebarData] = React.useState(data);

  React.useEffect(() => {
    setSidebarData(data);
  }, [data]);

  const handleLogout = React.useCallback(async () => {
    await supabase.auth.signOut();
    window.location.assign('/login');
  }, [supabase]);

  const handleProfileSave = React.useCallback(
    async (input: {
      profileId: string;
      orgId: string;
      displayName: string;
      firstName: string;
      lastName: string;
      bio?: string | null;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: input.displayName,
          first_name: input.firstName,
          last_name: input.lastName,
          bio: input.bio ?? null,
        })
        .eq('id', input.profileId)
        .eq('org_id', input.orgId);

      if (error) {
        throw error;
      }

      setSidebarData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          profile: {
            ...prev.user.profile,
            profile: {
              ...prev.user.profile.profile,
              displayName: input.displayName,
              firstName: input.firstName,
              lastName: input.lastName,
              bio: input.bio ?? null,
            },
          },
        },
      }));
    },
    [supabase],
  );

  return (
    <>
      <SidebarLeft
        data={sidebarData}
        activePath={pathname}
        onLogout={handleLogout}
        forceProfileCompletion={forceProfileCompletion}
        onProfileSave={handleProfileSave}
      />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
