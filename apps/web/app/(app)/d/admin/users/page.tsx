import type { Metadata } from 'next';

import { Button, DashboardHeader } from '@iconicedu/ui-web';

import { createSupabaseServerClient } from '../../../../../lib/supabase/server';
import { ORG } from '../../../../../lib/data/org';
import { UsersTable, type UserRow } from './users-table';

export const metadata: Metadata = {
  title: 'Admin · Users',
  description: 'Manage enrolled users, families, educators, and staff.',
};

type ProfileSummary = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  kind?: string | null;
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
        first_name,
        last_name,
        display_name,
        kind
      )
    `,
    )
    .eq('org_id', ORG.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const rows: UserRow[] =
    data?.map((account) => {
      const profile = account.profiles?.[0];
      return {
        accountId: account.id,
        email: account.email,
        phone: account.phone_e164,
        status: account.status,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
        profileKind: profile?.kind,
        displayName: profile?.display_name,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
      };
    }) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Users" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-1">
          <UsersTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
