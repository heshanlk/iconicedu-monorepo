import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@iconicedu/ui-web';

import type { AdminFamilyRow } from '@iconicedu/web/lib/admin/families';

type FamiliesTableProps = {
  rows: AdminFamilyRow[];
};

export function FamiliesTable({ rows }: FamiliesTableProps) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card">
      <div className="relative overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground tracking-tight uppercase">
                Family
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground tracking-tight uppercase">
                Guardians
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground tracking-tight uppercase">
                Children
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground tracking-tight uppercase">
                Pending invites
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground tracking-tight uppercase text-right">
                Links
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground tracking-tight uppercase">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.familyId}
                className="border-b border-border/70 last:border-0 hover:bg-card-light transition-colors"
              >
                <TableCell className="py-4">
                  <p className="text-sm font-semibold">{row.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(row.updatedAt).toLocaleDateString()}
                  </p>
                </TableCell>
                <TableCell className="py-4">
                  {row.guardians.length ? (
                    <div className="flex flex-col gap-1 text-xs">
                      {row.guardians.map((guardian) => (
                        <span key={guardian.id} className="text-sm">
                          {guardian.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No guardians</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {row.children.length ? (
                    <div className="flex flex-col gap-1 text-xs">
                      {row.children.map((child) => (
                        <span key={child.id} className="text-sm">
                          {child.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No children</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {row.pendingInvites.length ? (
                    <div className="flex flex-col gap-2">
                      {row.pendingInvites.map((invite) => (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="truncate">
                            {invite.invitedEmail ?? invite.invitedPhone ?? 'Invite'}
                          </span>
                          <Badge
                            variant={invite.status === 'pending' ? 'secondary' : 'outline'}
                            className="text-[11px] px-2"
                          >
                            {invite.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <Badge variant="outline">{row.familyLinkCount}</Badge>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
