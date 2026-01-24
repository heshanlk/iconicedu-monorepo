import type { Metadata } from 'next';

import { DashboardHeader } from '@iconicedu/ui-web';

import { createSupabaseServerClient } from '../../../../../lib/supabase/server';
import { ORG } from '../../../../../lib/data/org';
import { UsersTable, type UserRow } from './users-table';

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

export const metadata: Metadata = {
  title: 'Admin · Users',
  description: 'Manage enrolled users, families, educators, and staff.',
};

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from<AccountWithProfiles>('accounts')
    .select(
      `
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
    `,
    )
    .eq('org_id', ORG.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const rows: UserRow[] =
    data?.map((account) => {
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
    }) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Users" description="Enrolled accounts" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <UsersTable rows={rows} />
      </div>
    </div>
  );
}
