'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@iconicedu/ui-web';
import { Loader2, RotateCw } from 'lucide-react';

import type { LearningSpaceRow } from '@iconicedu/web/lib/admin/learning-spaces';
import { LearningSpacesTable } from '@iconicedu/web/app/(app)/d/admin/spaces/learning-spaces-table';
import { LearningSpaceFormDialog } from '@iconicedu/web/app/(app)/d/admin/spaces/learning-space-form-dialog';
import type { UserProfileVM } from '@iconicedu/shared-types';

const PAGE_SIZES = [10, 25, 50];

type LearningSpacesDashboardProps = {
  rows: LearningSpaceRow[];
};

export function LearningSpacesDashboard({ rows }: LearningSpacesDashboardProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | string>('all');
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZES[0]);
  const [isPending, startTransition] = React.useTransition();
  const [participantOptions, setParticipantOptions] = React.useState<UserProfileVM[]>([]);
  const refreshing = isPending;

  const loadParticipants = React.useCallback(async () => {
    try {
      const response = await fetch('/d/admin/spaces/actions/participants', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        setParticipantOptions([]);
        return;
      }
      const payload = (await response.json()) as { data?: UserProfileVM[] };
      setParticipantOptions(payload.data ?? []);
    } catch {
      setParticipantOptions([]);
    }
  }, []);

  React.useEffect(() => {
    setPageIndex(1);
  }, [search, statusFilter, pageSize]);

  React.useEffect(() => {
    void loadParticipants();
  }, [loadParticipants]);

  const normalizedSearch = search.trim().toLowerCase();

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
    return [...filteredRows].sort((a, b) => collator.compare(a.title, b.title));
  }, [filteredRows]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const visibleRows = sortedRows.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const handleRefresh = () => {
    startTransition(() => router.refresh());
    void loadParticipants();
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <LearningSpaceFormDialog
          participantOptions={participantOptions}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search title or subject"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Status:</span>
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
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh learning spaces"
          >
            {refreshing ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <RotateCw className="size-4 transition-transform" />
            )}
          </Button>
        </div>
      </div>
      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 rounded-2xl border border-border bg-card/70 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <LearningSpacesTable rows={visibleRows} />
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
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
        <div className="flex-1 flex items-center justify-end gap-2">
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
