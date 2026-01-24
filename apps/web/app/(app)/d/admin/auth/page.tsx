import type { Metadata } from 'next';

import {
  DashboardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@iconicedu/ui-web';

import { createAuthAdminService } from '../../../../../lib/auth/admin';
import { AuthAdminPanel } from './auth-panel';

export const metadata: Metadata = {
  title: 'Admin · Auth',
  description: 'Manage Supabase Auth users, invites, and OAuth clients.',
};

export default async function AdminAuthPage() {
  const authAdmin = createAuthAdminService();
  const [usersResult, oauthResult] = await Promise.all([
    authAdmin.listUsers({ perPage: 12 }),
    authAdmin.listOAuthClients({ perPage: 12 }),
  ]);

  const users = usersResult.data?.users ?? [];
  const clients = oauthResult.data?.clients ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Auth admin"
        description="Trigger supabase admin APIs without shipping service-role keys to the browser."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              Recent users ({users.length})
            </p>
          </div>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-xs font-mono">{user.id}</TableCell>
                  <TableCell>{user.email ?? '—'}</TableCell>
                  <TableCell>{user.role ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground">
            OAuth clients ({clients.length})
          </p>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="text-xs font-mono">{client.id}</TableCell>
                  <TableCell>{client.name ?? '—'}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {client.redirect_uris?.length ?? 0} redirect URIs
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
      <AuthAdminPanel users={users} oauthClients={clients} />
    </div>
  );
}
