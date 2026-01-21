'use client';

import * as React from 'react';
import {
  Badge,
  Briefcase,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GraduationCap,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Shield,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  Trash2,
  User,
  UserCheck,
  Users,
  MoreHorizontal,
  Pencil,
} from '@iconicedu/ui-web';
import { InviteUserDialog } from './invite-dialog';

export type UserRow = {
  accountId: string;
  email: string | null;
  phone?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  profileKind?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type SortKey = 'name' | 'email' | 'status' | 'joined';

type UsersTableProps = {
  rows: UserRow[];
};

const PAGE_SIZES = [10, 25, 50];

const STATUS_BADGE_VARIANTS: Record<string, string> = {
  active: 'default',
  invited: 'outline',
  archived: 'destructive',
};

const PROFILE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  guardian: Shield,
  educator: GraduationCap,
  child: Users,
  staff: Briefcase,
  owner: Shield,
  default: User,
};

export function UsersTable({ rows }: UsersTableProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | string>('all');
  const [sortKey, setSortKey] = React.useState<SortKey>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZES[0]);

  React.useEffect(() => {
    setPageIndex(1);
  }, [search, statusFilter, pageSize]);

  const normalizedSearch = React.useMemo(() => search.trim().toLowerCase(), [search]);

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      const title = (
        row.displayName ?? `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()
      ).toLowerCase();
      if (title.includes(normalizedSearch)) {
        return true;
      }
      if (row.email?.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      if (row.phone?.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      return false;
    });
  }, [rows, normalizedSearch, statusFilter]);

  const sortedRows = React.useMemo(() => {
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    return [...filteredRows].sort((a, b) => {
      let compare = 0;
      if (sortKey === 'name') {
        const nameA = a.displayName ?? `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim();
        const nameB = b.displayName ?? `${b.firstName ?? ''} ${b.lastName ?? ''}`.trim();
        compare = collator.compare(nameA || '', nameB || '');
      } else if (sortKey === 'email') {
        compare = collator.compare(a.email ?? '', b.email ?? '');
      } else if (sortKey === 'status') {
        compare = collator.compare(a.status, b.status);
      } else {
        compare = collator.compare(a.createdAt, b.createdAt);
      }
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [filteredRows, sortDirection, sortKey]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const visibleRows = sortedRows.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  const toggleAction = (action: string, id: string) => {
    window.alert(`${action} user ${id}`);
  };

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return null;
    }
    return (
      <span aria-hidden="true" className="ml-1 text-xs opacity-70">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="w-full space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <InviteUserDialog />
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search name, email or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | string)}
            >
              <SelectTrigger size="sm" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <button
                type="button"
                className="flex items-center"
                onClick={() => handleSort('name')}
              >
                Name {renderSortIndicator('name')}
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="flex items-center"
                onClick={() => handleSort('email')}
              >
                Email {renderSortIndicator('email')}
              </button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <button
                type="button"
                className="flex items-center"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIndicator('status')}
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="flex items-center"
                onClick={() => handleSort('joined')}
              >
                Joined {renderSortIndicator('joined')}
              </button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row) => {
            const fallbackName = `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim();
            const resolvedName = row.displayName ?? fallbackName;
            const displayName = resolvedName || 'Unnamed';
            return (
              <TableRow key={row.accountId}>
                <TableCell>
                  <p className="text-sm font-semibold">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.email ?? 'no email'}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{row.email ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">{row.phone ?? '—'}</p>
                </TableCell>
                <TableCell>
                  <div
                    className="flex items-center gap-2"
                    title={row.profileKind ?? 'Account'}
                  >
                    {(() => {
                      const kind = row.profileKind ?? 'account';
                      const Icon = PROFILE_ICON_MAP[kind] ?? PROFILE_ICON_MAP.default;
                      return (
                        <Icon className="size-4 text-muted-foreground" aria-hidden />
                      );
                    })()}
                    <span className="sr-only">{row.profileKind ?? 'account'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={STATUS_BADGE_VARIANTS[row.status] ?? 'ghost'}
                    className="text-xs capitalize"
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(row.updatedAt).toLocaleDateString()}
                  </p>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="px-2">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toggleAction('Edit', row.accountId)}
                      >
                        <Pencil className="size-3 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleAction('Change status', row.accountId)}
                      >
                        <UserCheck className="size-3 mr-2" /> Change status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleAction('Delete', row.accountId)}
                      >
                        <Trash2 className="size-3 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Page size</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={pageIndex <= 1}
            onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span>
            Page {pageIndex} of {pageCount}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={pageIndex >= pageCount}
            onClick={() => setPageIndex((prev) => Math.min(pageCount, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
