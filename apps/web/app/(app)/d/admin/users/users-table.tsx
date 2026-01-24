'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@iconicedu/ui-web';
import {
  Briefcase,
  GraduationCap,
  Shield,
  User,
  Users,
  UserCheck,
  Trash2,
  Pencil,
  MoreHorizontal,
  RotateCw,
} from 'lucide-react';
import { cn } from '@iconicedu/ui-web/lib/utils';

import { InviteUserDialog } from './invite-dialog';

export type UserRow = {
  id: string;
  email?: string | null;
  phone?: string | null;
  profileKind?: string | null;
  status: 'active' | 'invited' | 'archived' | string;
  createdAt?: string | null;
  lastSignInAt?: string | null;
  displayName?: string | null;
};

type SortKey = 'name' | 'email' | 'status' | 'joined';

type UsersTableProps = {
  rows: UserRow[];
};

const STATUS_BADGE_VARIANTS: Record<string, string> = {
  active: 'default',
  invited: 'outline',
  archived: 'destructive',
};

const PROFILE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  educator: GraduationCap,
  staff: Briefcase,
  guardian: Users,
  child: Shield,
  owner: Shield,
  default: User,
};

const PAGE_SIZES = [10, 25, 50];

export function UsersTable({ rows }: UsersTableProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await router.refresh();
    setRefreshing(false);
  };

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
        row.displayName ??
        row.email ??
        row.profileKind ??
        ''
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
      if (row.profileKind?.toLowerCase().includes(normalizedSearch)) {
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
        compare = collator.compare(a.displayName ?? '', b.displayName ?? '');
      } else if (sortKey === 'email') {
        compare = collator.compare(a.email ?? '', b.email ?? '');
      } else if (sortKey === 'status') {
        compare = collator.compare(a.status, b.status);
      } else {
        compare = collator.compare(a.createdAt ?? '', b.createdAt ?? '');
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
          <div className="flex items-center gap-2">
            <InviteUserDialog />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search name, email or role"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-64"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
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
            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh users"
            >
              <RotateCw className={cn('size-4 transition-transform', refreshing && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('name')}>
                Name {renderSortIndicator('name')}
              </button>
            </TableHead>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('email')}>
                Email {renderSortIndicator('email')}
              </button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('status')}>
                Status {renderSortIndicator('status')}
              </button>
            </TableHead>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('joined')}>
                Joined {renderSortIndicator('joined')}
              </button>
            </TableHead>
            <TableHead>Last seen</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row) => {
            const displayName = row.displayName || row.email || 'Unnamed';
            const Icon = PROFILE_ICON_MAP[row.role ?? 'default'] ?? PROFILE_ICON_MAP.default;
            return (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="text-sm font-semibold capitalize">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{row.phone ?? row.email ?? '—'}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{row.email ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">{row.phone ?? '—'}</p>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-2 text-sm capitalize">
                    <Icon className="size-4 text-muted-foreground" aria-hidden />
                    {row.profileKind ?? 'account'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANTS[row.status] ?? 'ghost'} className="text-xs capitalize">
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {row.createdAt ? (
                    <p className="text-sm">{new Date(row.createdAt).toLocaleDateString()}</p>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.lastSignInAt ? (
                    <p className="text-sm">{new Date(row.lastSignInAt).toLocaleDateString()}</p>
                  ) : (
                    <span className="text-sm text-muted-foreground">n/a</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="px-2">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleAction('Edit', row.id)}>
                        <Pencil className="size-3 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleAction('Change status', row.id)}>
                        <UserCheck className="size-3 mr-2" /> Change status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleAction('Delete', row.id)}>
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
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
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
