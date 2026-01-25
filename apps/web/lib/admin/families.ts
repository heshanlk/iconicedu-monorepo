import type { AccountRow, FamilyLinkInviteRow } from '@iconicedu/shared-types';

import { createSupabaseServerClient } from '../supabase/server';
import { ORG } from '../data/org';
import { ACCOUNT_SELECT } from '../user/constants/selects';

type FamilyRow = {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

type FamilyLinkRow = {
  id: string;
  family_id: string;
  guardian_account_id: string;
  child_account_id: string;
};

export type AdminFamilyParticipant = {
  id: string;
  label: string;
};

export type AdminFamilyInviteSummary = {
  id: string;
  invitedEmail?: string | null;
  invitedPhone?: string | null;
  invitedRole: FamilyLinkInviteRow['invited_role'];
  status: FamilyLinkInviteRow['status'];
  createdAt: string;
};

export type AdminFamilyRow = {
  familyId: string;
  displayName: string;
  guardians: AdminFamilyParticipant[];
  children: AdminFamilyParticipant[];
  pendingInvites: AdminFamilyInviteSummary[];
  familyLinkCount: number;
  createdAt: string;
  updatedAt: string;
};

const FAMILY_SELECT = 'id, display_name, created_at, updated_at';
const FAMILY_LINK_SELECT =
  'id, family_id, guardian_account_id, child_account_id';
const FAMILY_INVITE_SELECT =
  'id, family_id, invited_email, invited_phone_e164, invited_role, status, created_at';

function formatLabel(account?: AccountRow) {
  if (!account) {
    return 'Unknown account';
  }
  return (
    account.email?.trim() ||
    account.phone_e164 ||
    `Account ${account.id.slice(0, 8)}`
  );
}

export async function getAdminFamilyRows(): Promise<AdminFamilyRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data: families } = await supabase
    .from<FamilyRow>('families')
    .select(FAMILY_SELECT)
    .eq('org_id', ORG.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (!families?.length) {
    return [];
  }

  const familyIds = families.map((family) => family.id);

  const { data: links } = await supabase
    .from<FamilyLinkRow>('family_links')
    .select(FAMILY_LINK_SELECT)
    .in('family_id', familyIds)
    .eq('org_id', ORG.id)
    .is('deleted_at', null);

  const accountIds = new Set<string>();
  links?.forEach((link) => {
    accountIds.add(link.guardian_account_id);
    accountIds.add(link.child_account_id);
  });

  const accounts =
    accountIds.size > 0
      ? await supabase
          .from<AccountRow>('accounts')
          .select(ACCOUNT_SELECT)
          .in('id', Array.from(accountIds))
          .is('deleted_at', null)
      : { data: [] };

  const accountMap = new Map<string, AccountRow>();
  accounts.data?.forEach((account) => accountMap.set(account.id, account));

  const { data: invites } = await supabase
    .from<FamilyLinkInviteRow>('family_link_invites')
    .select(FAMILY_INVITE_SELECT)
    .in('family_id', familyIds)
    .eq('org_id', ORG.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const invitesByFamily = new Map<string, FamilyLinkInviteRow[]>();
  invites?.forEach((invite) => {
    const existing = invitesByFamily.get(invite.family_id) ?? [];
    existing.push(invite);
    invitesByFamily.set(invite.family_id, existing);
  });

  const linksByFamily = new Map<string, FamilyLinkRow[]>();
  links?.forEach((link) => {
    const existing = linksByFamily.get(link.family_id) ?? [];
    existing.push(link);
    linksByFamily.set(link.family_id, existing);
  });

  return families.map((family) => {
    const familyLinks = linksByFamily.get(family.id) ?? [];

    const guardianMap = new Map<string, AdminFamilyParticipant>();
    const childMap = new Map<string, AdminFamilyParticipant>();

    familyLinks.forEach((link) => {
      guardianMap.set(link.guardian_account_id, {
        id: link.guardian_account_id,
        label: formatLabel(accountMap.get(link.guardian_account_id)),
      });
      childMap.set(link.child_account_id, {
        id: link.child_account_id,
        label: formatLabel(accountMap.get(link.child_account_id)),
      });
    });

    const pendingInvites = (invitesByFamily.get(family.id) ?? []).map((invite) => ({
      id: invite.id,
      invitedEmail: invite.invited_email,
      invitedPhone: invite.invited_phone_e164,
      invitedRole: invite.invited_role,
      status: invite.status,
      createdAt: invite.created_at,
    }));

    return {
      familyId: family.id,
      displayName: family.display_name,
      guardians: Array.from(guardianMap.values()),
      children: Array.from(childMap.values()),
      pendingInvites,
      familyLinkCount: familyLinks.length,
      createdAt: family.created_at,
      updatedAt: family.updated_at ?? family.created_at,
    };
  });
}
