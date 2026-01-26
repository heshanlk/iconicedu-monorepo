import type { UserProfileVM } from '@iconicedu/shared-types';
import type { FamilyLinkRow, ProfileRow } from '@iconicedu/shared-types';

import { createSupabaseServerClient } from '../supabase/server';
import { ORG } from '../data/org';
import { PROFILE_SELECT } from '../user/constants/selects';
import { mapBaseProfile } from '../user/mappers/base-profile.mapper';

type AccountWithProfiles = {
  id: string;
  email: string | null;
  status: string;
  profiles?: ProfileRow[];
};

type GuardianNameMap = Map<string, string[]>;

const ACCOUNT_WITH_PROFILE_SELECT = `
  id,
  email,
  status,
  profiles (
    ${PROFILE_SELECT}
  )
`;

function getDisplayName(profile: ProfileRow) {
  const name = profile.display_name?.trim();
  if (name) return name;
  const fallback = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
  return fallback || null;
}

function mapProfileToUserProfile(
  profile: ProfileRow,
  accountEmail: string | null,
  guardianNames: string[] | null,
): UserProfileVM {
  const base = mapBaseProfile(profile, {
    notificationDefaults: null,
    presence: null,
    accountEmail,
  });

  switch (profile.kind) {
    case 'guardian':
      return {
        ...base,
        kind: 'guardian',
        joinedDate: profile.created_at,
      };
    case 'educator':
      return {
        ...base,
        kind: 'educator',
        joinedDate: profile.created_at,
      };
    case 'child':
      return {
        ...base,
        kind: 'child',
        guardianNames,
      };
    case 'staff':
      return {
        ...base,
        kind: 'staff',
      };
    case 'system':
      return {
        ...base,
        kind: 'system',
      };
    default:
      return {
        ...base,
        kind: 'staff',
      };
  }
}

export async function getActiveParticipantProfiles(): Promise<UserProfileVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from<AccountWithProfiles>('accounts')
    .select(ACCOUNT_WITH_PROFILE_SELECT)
    .eq('org_id', ORG.id)
    .eq('status', 'active')
    .is('deleted_at', null);

  if (!data) {
    return [];
  }

  const { data: guardianProfiles } = await supabase
    .from<ProfileRow>('profiles')
    .select(PROFILE_SELECT)
    .eq('org_id', ORG.id)
    .eq('kind', 'guardian')
    .is('deleted_at', null);

  const { data: familyLinks } = await supabase
    .from<FamilyLinkRow>('family_links')
    .select('guardian_account_id, child_account_id')
    .eq('org_id', ORG.id)
    .is('deleted_at', null);

  const guardianNameByAccountId: GuardianNameMap = new Map();
  (guardianProfiles ?? []).forEach((profile) => {
    if (profile.deleted_at) return;
    const name = getDisplayName(profile);
    if (!name) return;
    const existing = guardianNameByAccountId.get(profile.account_id) ?? [];
    guardianNameByAccountId.set(profile.account_id, [...existing, name]);
  });

  const guardianNamesByChildAccountId: GuardianNameMap = new Map();
  (familyLinks ?? []).forEach((link) => {
    const guardianNames = guardianNameByAccountId.get(link.guardian_account_id);
    if (!guardianNames?.length) return;
    const existing = guardianNamesByChildAccountId.get(link.child_account_id) ?? [];
    guardianNamesByChildAccountId.set(link.child_account_id, [
      ...existing,
      ...guardianNames,
    ]);
  });

  return data.flatMap((account) =>
    (account.profiles ?? [])
      .filter((profile) => !profile.deleted_at)
      .map((profile) =>
        mapProfileToUserProfile(
          profile,
          account.email,
          profile.kind === 'child'
            ? guardianNamesByChildAccountId.get(profile.account_id) ?? null
            : null,
        ),
      ),
  );
}
