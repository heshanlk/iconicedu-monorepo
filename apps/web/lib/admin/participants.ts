import type { UserProfileVM } from '@iconicedu/shared-types';
import type { ProfileRow } from '@iconicedu/shared-types';

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

const ACCOUNT_WITH_PROFILE_SELECT = `
  id,
  email,
  status,
  profiles (
    ${PROFILE_SELECT}
  )
`;

function mapProfileToUserProfile(
  profile: ProfileRow,
  accountEmail: string | null,
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

  return data.flatMap((account) =>
    (account.profiles ?? [])
      .filter((profile) => !profile.deleted_at)
      .map((profile) => mapProfileToUserProfile(profile, account.email)),
  );
}
