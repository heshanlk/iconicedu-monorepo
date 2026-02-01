'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Loader2,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Plus,
  RotateCw,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@iconicedu/ui-web';

import type { AdminChannelRow } from '@iconicedu/web/lib/admin/channels';
import { ChannelsTable } from '@iconicedu/web/app/(app)/d/admin/channels/channels-table';

const PAGE_SIZES = [10, 25, 50];

type ChannelsDashboardProps = {
  rows: AdminChannelRow[];
};

type CreateChannelFormState = {
  topic: string;
  description: string;
  purpose: string;
};

export function ChannelsDashboard({ rows }: ChannelsDashboardProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | string>('all');
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZES[0]);
  const [isPending, startTransition] = React.useTransition();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [formState, setFormState] = React.useState<CreateChannelFormState>({
    topic: '',
    description: '',
    purpose: 'general',
  });

  React.useEffect(() => {
    setPageIndex(1);
  }, [search, statusFilter, pageSize]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      if (row.topic?.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      if (row.purpose?.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      if (row.kind?.toLowerCase().includes(normalizedSearch)) {
        return true;
      }
      return false;
    });
  }, [rows, normalizedSearch, statusFilter]);

  const sortedRows = React.useMemo(() => {
    const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
    return [...filteredRows].sort((a, b) => collator.compare(a.topic, b.topic));
  }, [filteredRows]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const visibleRows = sortedRows.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const handleRefresh = () => {
    startTransition(() => router.refresh());
  };

  const updateFormState = (patch: Partial<CreateChannelFormState>) => {
    setFormState((prev) => ({ ...prev, ...patch }));
  };

  const resetCreateForm = () => {
    setFormState({ topic: '', description: '', purpose: 'general' });
    setCreateError(null);
  };

  const handleCreate = async () => {
    if (!formState.topic.trim()) {
      setCreateError('Channel name is required.');
      return;
    }
    setIsCreating(true);
    setCreateError(null);
    try {
      const response = await fetch('/d/admin/channels/actions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formState.topic.trim(),
          description: formState.description.trim() || null,
          purpose: formState.purpose,
        }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) {
        setCreateError(payload.message ?? 'Unable to create channel.');
        return;
      }
      setCreateOpen(false);
      resetCreateForm();
      handleRefresh();
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Unable to create channel.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open);
            if (!open) {
              resetCreateForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Plus className="size-4" />
              Create channel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create channel</DialogTitle>
              <DialogDescription>
                Create a new channel that will appear in the admin list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="channel-topic">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="channel-topic"
                  value={formState.topic}
                  onChange={(event) => updateFormState({ topic: event.target.value })}
                  placeholder="e.g., General updates"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="channel-purpose">Type</Label>
                <Select
                  value={formState.purpose}
                  onValueChange={(value) => updateFormState({ purpose: value })}
                >
                  <SelectTrigger id="channel-purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="learning-space">Learning space</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="announcements">Announcements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="channel-description">Description</Label>
                <Input
                  id="channel-description"
                  value={formState.description}
                  onChange={(event) => updateFormState({ description: event.target.value })}
                  placeholder="Optional description"
                />
              </div>
              {createError ? (
                <p className="text-sm text-destructive">{createError}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setCreateOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? 'Creating…' : 'Create channel'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search name or type"
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
              <SelectTrigger size="sm" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Page size:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="px-2"
          onClick={handleRefresh}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <RotateCw className="size-4 transition-transform" />
          )}
        </Button>
      </div>

      <div className="relative">
        {isPending ? (
          <div className="absolute inset-0 rounded-2xl border border-border bg-card/70 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : null}
        <ChannelsTable rows={visibleRows} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>
            Showing {(pageIndex - 1) * pageSize + 1}-
            {Math.min(pageIndex * pageSize, totalRows)} of {totalRows}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
            disabled={pageIndex === 1}
          >
            Prev
          </Button>
          <span>
            Page {pageIndex} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.min(pageCount, prev + 1))}
            disabled={pageIndex === pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
