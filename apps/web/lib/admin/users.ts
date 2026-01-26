import type { AccountRow, ProfileRow } from '@iconicedu/shared-types';

import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { ORG } from '@iconicedu/web/lib/data/org';
import { getAccountsByOrgId } from '@iconicedu/web/lib/accounts/queries/accounts.query';
import { getProfileSummariesByAccountIds } from '@iconicedu/web/lib/profile/queries/profiles.query';

export type AdminUserRow = {
  id: string;
  email?: string | null;
  phone?: string | null;
  status: 'active' | 'invited' | 'archived' | string;
  createdAt: string;
  lastSignInAt: string;
  displayName?: string | null;
  profileKind?: string | null;
};

function mapAccountToRow(account: AccountRow, profile?: ProfileRow | null): AdminUserRow {
  const normalizedStatus = account.status?.toLowerCase() ?? '';
  const status =
    normalizedStatus === 'deleted'
      ? 'archived'
      : normalizedStatus === 'invited'
        ? 'invited'
        : 'active';
  const profileKind = profile?.kind ?? null;
  const profileName =
    profile?.display_name?.trim() ||
    [profile?.first_name, profile?.last_name]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(' ')
      .trim() ||
    null;
  return {
    id: account.id,
    email: account.email,
    phone: account.phone_e164 ?? null,
    status,
    createdAt: account.created_at,
    lastSignInAt: account.updated_at,
    displayName: profileName ?? account.email,
    profileKind,
  };
}

export async function getAdminUserRows(): Promise<AdminUserRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data: accounts } = await getAccountsByOrgId(supabase, ORG.id);

  if (!accounts?.length) {
    return [];
  }

  const sortedAccounts = [...accounts].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
  const accountIds = sortedAccounts.map((account) => account.id);
  const { data: profiles } = await getProfileSummariesByAccountIds(
    supabase,
    ORG.id,
    accountIds,
  );

  const profileByAccountId = new Map<string, ProfileRow>();
  profiles?.forEach((profile) => {
    if (!profile.account_id || profileByAccountId.has(profile.account_id)) {
      return;
    }
    profileByAccountId.set(profile.account_id, profile);
  });

  return sortedAccounts.map((account) =>
    mapAccountToRow(account, profileByAccountId.get(account.id) ?? null),
  );
}
