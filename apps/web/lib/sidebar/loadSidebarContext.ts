import type { SupabaseClient } from '@supabase/supabase-js';

import type { SidebarLeftDataVM, UserAccountVM, UserProfileVM } from '@iconicedu/shared-types';

import { buildSidebarUser } from './user/buildSidebarUser';

export async function loadSidebarContext(
  supabase: SupabaseClient,
  input: {
    authUser: {
      id: string;
      email?: string | null;
      user_metadata?: Record<string, unknown>;
      app_metadata?: Record<string, unknown>;
    };
    account: { id: string; org_id: string };
    baseSidebarData: SidebarLeftDataVM;
  },
): Promise<{
  sidebarData: SidebarLeftDataVM;
  accountVM: UserAccountVM;
  profileVM: UserProfileVM;
  needsNameCompletion: boolean;
  needsPhoneCompletion: boolean;
}> {
  const { accountVM, profileVM } = await buildSidebarUser(
    supabase,
    input.authUser,
    input.account,
  );

  const needsNameCompletion =
    !profileVM.profile.firstName?.trim() || !profileVM.profile.lastName?.trim();
  const needsPhoneCompletion =
    !accountVM.contacts.phoneE164?.trim() || !accountVM.contacts.phoneVerified;

  return {
    sidebarData: {
      ...input.baseSidebarData,
      user: {
        profile: profileVM,
        account: accountVM,
      },
    },
    accountVM,
    profileVM,
    needsNameCompletion,
    needsPhoneCompletion,
  };
}
