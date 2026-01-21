'use client';

import * as React from 'react';
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
  MoreHorizontal,
  Pencil,
  Shield,
  Stack,
  Layers,
  Users,
  User,
  Trash2,
} from '@iconicedu/ui-web';

export type LearningSpaceRow = {
  id: string;
  title: string;
  kind: 'one_on_one' | 'small_group' | 'large_class';
  status: string;
  subject?: string | null;
  createdAt: string;
  updatedAt: string;
  description?: string | null;
};

type SortKey = 'title' | 'subject' | 'kind' | 'status' | 'created';

const PAGE_SIZES = [10, 25, 50];

const KIND_ICON_MAP: Record<LearningSpaceRow['kind'], React.ComponentType<{ className?: string }>> = {
  one_on_one: User,
  small_group: Users,
  large_class: Layers,
};

const STATUS_BADGE_VARIANTS: Record<string, 'secondary' | 'outline' | 'ghost' | 'destructive'> = {
  active: 'secondary',
  archived: 'outline',
  completed: 'ghost',
  paused: 'ghost',
};

export function LearningSpacesTable({ rows }: { rows: LearningSpaceRow[] }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | string>('all');
  const [sortKey, setSortKey] = React.useState<SortKey>('title');
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
      if (row.title.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      if (row.subject?.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      if (row.description?.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      return false;
    });
  }, [rows, normalizedSearch, statusFilter]);

  const sortedRows = React.useMemo(() => {
    const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
    return [...filteredRows].sort((a, b) => {
      let result = 0;
      switch (sortKey) {
        case 'title':
          result = collator.compare(a.title, b.title);
          break;
        case 'subject':
          result = collator.compare(a.subject ?? '', b.subject ?? '');
          break;
        case 'kind':
          result = collator.compare(a.kind, b.kind);
          break;
        case 'status':
          result = collator.compare(a.status, b.status);
          break;
        default:
          result = collator.compare(a.createdAt, b.createdAt);
      }
      return sortDirection === 'asc' ? result : -result;
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

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return null;
    }
    return (
      <span className="ml-1 text-xs opacity-70">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const toggleAction = (action: string, id: string) => {
    window.alert(`${action} learning space ${id}`);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Learning spaces
          </p>
          <p className="text-lg font-semibold text-foreground">All spaces</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search title or subject"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | string)}>
              <SelectTrigger size="sm" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('title')}>
                Title {renderSortIndicator('title')}
              </button>
            </TableHead>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('subject')}>
                Subject {renderSortIndicator('subject')}
              </button>
            </TableHead>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('kind')}>
                Kind {renderSortIndicator('kind')}
              </button>
            </TableHead>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('status')}>
                Status {renderSortIndicator('status')}
              </button>
            </TableHead>
            <TableHead>
              <button type="button" className="flex items-center" onClick={() => handleSort('created')}>
                Created {renderSortIndicator('created')}
              </button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <p className="text-sm font-semibold">{row.title}</p>
                <p className="text-xs text-muted-foreground">{row.description ?? 'No description'}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm">{row.subject ?? 'General'}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {React.createElement(KIND_ICON_MAP[row.kind], {
                    className: 'size-4 text-muted-foreground',
                  })}
                  <span className="text-sm capitalize">{row.kind.replaceAll('_', ' ')}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={STATUS_BADGE_VARIANTS[row.status] ?? 'ghost'}
                  className="text-xs uppercase tracking-[0.2em]"
                >
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>
                <p className="text-sm">{new Date(row.createdAt).toLocaleDateString()}</p>
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
                    <DropdownMenuItem onClick={() => toggleAction('Edit', row.id)}>
                      <Pencil className="size-3 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleAction('Manage', row.id)}>
                      <Stack className="size-3 mr-2" /> Manage resources
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleAction('Archive', row.id)}>
                      <Trash2 className="size-3 mr-2" /> Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
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
