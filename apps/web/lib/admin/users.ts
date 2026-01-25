import { createSupabaseServerClient } from '../supabase/server';
import { ORG } from '../data/org';

type ProfileSummary = {
  id: string;
  kind?: string | null;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

type AccountWithProfiles = {
  id: string;
  email: string | null;
  phone_e164?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: ProfileSummary[];
};

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

function mapAccountToRow(account: AccountWithProfiles): AdminUserRow {
  const normalizedStatus = account.status?.toLowerCase() ?? '';
  const status =
    normalizedStatus === 'deleted'
      ? 'archived'
      : normalizedStatus === 'invited'
        ? 'invited'
        : 'active';
  const profile = account.profiles?.[0];
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

const ACCOUNT_SELECT = `
  id,
  email,
  phone_e164,
  status,
  created_at,
  updated_at,
  profiles (
    id,
    kind,
    display_name,
    first_name,
    last_name
  )
`;

export async function getAdminUserRows(): Promise<AdminUserRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from<AccountWithProfiles>('accounts')
    .select(ACCOUNT_SELECT)
    .eq('org_id', ORG.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (!data) {
    return [];
  }

  return data.map(mapAccountToRow);
}
