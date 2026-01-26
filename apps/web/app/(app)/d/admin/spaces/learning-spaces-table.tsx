'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@iconicedu/ui-web';
import { Shield, Users, User, Layers } from 'lucide-react';

import type { LearningSpaceRow } from '@iconicedu/web/lib/admin/learning-spaces';

const KIND_ICON_MAP = {
  one_on_one: User,
  small_group: Users,
  large_class: Layers,
};

export function LearningSpacesTable({ rows }: { rows: LearningSpaceRow[] }) {
  return (
    <div className="w-full border-y border-border bg-card">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const Icon = KIND_ICON_MAP[row.kind] ?? Shield;
            return (
              <TableRow
                key={row.id}
                className="border-b border-border/60 last:border-b-0"
              >
                <TableCell>
                  <p className="text-sm font-semibold">{row.title}</p>
                  {row.description && (
                    <p className="text-xs text-muted-foreground">{row.description}</p>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{row.subject ?? '—'}</p>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="capitalize text-sm">{row.kind.replace('_', ' ')}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.status === 'active'
                        ? 'secondary'
                        : row.status === 'archived'
                          ? 'outline'
                          : 'ghost'
                    }
                    className="text-xs px-3"
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
