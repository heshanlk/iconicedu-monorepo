import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  AccountRow,
  SidebarLeftDataVM,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import type { FamilyLinkInviteRow } from '@iconicedu/shared-types';

import { acceptFamilyInvite } from '../family/invite';
import { buildSidebarUser } from './user/buildSidebarUser';
import { getAccountById } from './user/queries/accounts.query';

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
    familyInvite?: FamilyLinkInviteRow | null;
  },
): Promise<{
  sidebarData: SidebarLeftDataVM;
  accountVM: UserAccountVM;
  profileVM: UserProfileVM;
  needsNameCompletion: boolean;
  needsPhoneCompletion: boolean;
}> {
  await autoAcceptPendingInvites(supabase, input.account.id);

  const { accountVM, profileVM } = await buildSidebarUser(
    supabase,
    input.authUser,
    input.account,
    input.familyInvite ?? null,
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

async function autoAcceptPendingInvites(supabase: SupabaseClient, accountId: string) {
  const accountResponse = await getAccountById(supabase, accountId);
  const account = accountResponse.data as AccountRow | null;
  if (!account) {
    return;
  }

  const { data: pendingInvitesResponse, error } = await supabase
    .from('family_link_invites')
    .select('id, invited_email, invited_phone_e164')
    .eq('org_id', account.org_id)
    .eq('status', 'pending')
    .is('deleted_at', null);

  if (error || !pendingInvitesResponse) {
    return;
  }

  const normalizedEmail = account.email?.trim().toLowerCase();
  const normalizedPhone = account.phone_e164?.trim();

  const matches = pendingInvitesResponse.filter((invite) => {
    const inviteEmail = invite.invited_email?.trim().toLowerCase() ?? null;
    const invitePhone = invite.invited_phone_e164?.trim() ?? null;
    return (
      (normalizedEmail && inviteEmail && inviteEmail === normalizedEmail) ||
      (normalizedPhone && invitePhone && invitePhone === normalizedPhone)
    );
  });

  for (const invite of matches) {
    try {
      await acceptFamilyInvite({
        inviteId: invite.id,
        account,
        relation: 'guardian',
      });
    } catch (error) {
      console.error('Failed to auto-accept family invite', error);
    }
  }
}
