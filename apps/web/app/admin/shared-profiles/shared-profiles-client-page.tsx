'use client';

import { ResourceFormDialog } from '@repo/ui/blocks/resource-form-dialog';
import { ResourceListPage } from '@repo/ui/blocks/resource-list-page';
import type { ResourceColumn } from '@repo/ui/blocks/resource-table';
import { Badge } from '@repo/ui/primitives/badge';
import { Button } from '@repo/ui/primitives/button';
import { Input } from '@repo/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/ui/primitives/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  apiFetch,
  CandidateQueryResponse,
  SharedProfile,
  SharedProfilesQueryResponse
} from '../../../lib/chromedia-api';

type StatusFilter = 'All' | 'Active' | 'Expired' | 'Revoked';
type CreateForm = {
  candidateId: string;
  sharedWithName: string;
  sharedWithEmail: string;
  rateLabel: string;
  expirationDate: string;
};
type AdjustForm = {
  rateLabel: string;
  expirationDate: string;
};

const sortOptions = [
  { label: 'Shared On (newest)', value: 'sharedAt:desc' },
  { label: 'Shared On (oldest)', value: 'sharedAt:asc' },
  { label: 'Expiration', value: 'expirationDate:asc' },
  { label: 'Opened Count', value: 'accessCount:desc' }
] as const;

const statusOptions: StatusFilter[] = ['All', 'Active', 'Expired', 'Revoked'];

const initialCreateForm: CreateForm = {
  candidateId: '',
  sharedWithName: '',
  sharedWithEmail: '',
  rateLabel: '',
  expirationDate: ''
};

export default function AdminSharedProfilesClientPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<SharedProfile[]>([]);
  const [candidateOptions, setCandidateOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [status, setStatus] = useState<StatusFilter>((searchParams.get('status') as StatusFilter) ?? 'All');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'sharedAt:desc');

  const [createForm, setCreateForm] = useState<CreateForm>(initialCreateForm);
  const [adjusting, setAdjusting] = useState<SharedProfile | null>(null);
  const [adjustForm, setAdjustForm] = useState<AdjustForm>({ rateLabel: '', expirationDate: '' });

  const syncUrl = (next: Partial<{ q: string; status: StatusFilter; sort: string }>) => {
    const params = new URLSearchParams(searchParams.toString());
    const merged = {
      q: next.q ?? query,
      status: next.status ?? status,
      sort: next.sort ?? sort
    };
    if (merged.q.trim()) params.set('q', merged.q.trim());
    else params.delete('q');
    if (merged.status !== 'All') params.set('status', merged.status);
    else params.delete('status');
    if (merged.sort !== 'sharedAt:desc') params.set('sort', merged.sort);
    else params.delete('sort');
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false
    });
  };

  const loadRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortBy = 'sharedAt', sortDir = 'desc'] = sort.split(':');
      const params = new URLSearchParams({
        page: '1',
        pageSize: '50',
        sortBy,
        sortDir
      });
      if (query.trim()) params.set('q', query.trim());
      if (status !== 'All') params.set('status', status);
      const result = await apiFetch<SharedProfilesQueryResponse>(
        `/shared-profiles/query?${params.toString()}`
      );
      setRows(result.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load shared profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, [query, status, sort]);

  useEffect(() => {
    void (async () => {
      const result = await apiFetch<CandidateQueryResponse>('/candidates/query?page=1&pageSize=100');
      setCandidateOptions(result.items.map((item) => ({ id: item.id, name: item.name })));
      if (!createForm.candidateId && result.items[0]) {
        setCreateForm((prev) => ({ ...prev, candidateId: result.items[0].id }));
      }
    })();
  }, []);

  const columns = useMemo<Array<ResourceColumn<SharedProfile>>>(
    () => [
      {
        key: 'profile',
        header: 'Profile',
        render: (row) => (
          <div className="min-w-48">
            <p className="font-medium">{row.candidateName}</p>
            <p className="text-xs text-slate-500">{row.candidateRole}</p>
          </div>
        )
      },
      {
        key: 'sharedWith',
        header: 'Shared With',
        render: (row) => (
          <div>
            <p className="font-medium">{row.sharedWithName}</p>
            <p className="text-xs text-slate-500">{row.sharedWithEmail}</p>
          </div>
        )
      },
      { key: 'rateLabel', header: 'Rate' },
      {
        key: 'availability',
        header: 'Link Availability',
        render: (row) => new Date(row.expirationDate).toLocaleDateString()
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <Badge
            variant={
              row.status === 'Active'
                ? 'default'
                : row.status === 'Revoked'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {row.status}
          </Badge>
        )
      },
      {
        key: 'opened',
        header: 'Opened',
        render: (row) =>
          row.lastAccessedAt
            ? `${row.accessCount} (last ${new Date(row.lastAccessedAt).toLocaleDateString()})`
            : `${row.accessCount}`
      },
      {
        key: 'sharedAt',
        header: 'Shared On',
        render: (row) => new Date(row.sharedAt).toLocaleDateString()
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const url = `${window.location.origin}/shared/${row.shareToken}`;
                await navigator.clipboard.writeText(url).catch(() => null);
                window.alert('Link copied.');
              }}
            >
              Copy Link
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const url = `${window.location.origin}/shared/${row.shareToken}`;
                await navigator.clipboard.writeText(url).catch(() => null);
                window.alert('Resend link copied.');
              }}
            >
              Resend
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAdjusting(row);
                setAdjustForm({
                  rateLabel: row.rateLabel,
                  expirationDate: row.expirationDate.slice(0, 16)
                });
              }}
            >
              Adjust
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={row.status === 'Revoked'}
              onClick={async () => {
                await apiFetch(`/shared-profiles/${row.id}/revoke`, { method: 'POST' });
                await loadRows();
              }}
            >
              Revoke
            </Button>
          </div>
        )
      }
    ],
    [rows]
  );

  return (
    <div className="space-y-6">
      <ResourceListPage
        title="Shared Profiles"
        description="Track profile share links, status, and access history."
        createLabel="Share Profile"
        rows={rows}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={() => loadRows()}
        onSearch={(value) => {
          setQuery(value);
          syncUrl({ q: value });
        }}
        searchValue={query}
        searchPlaceholder="Search candidate or recipient..."
        onFilter={
          <div className="flex flex-wrap gap-2">
            <Select
              value={status}
              onValueChange={(value) => {
                const next = value as StatusFilter;
                setStatus(next);
                syncUrl({ status: next });
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                syncUrl({ sort: value });
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        onCreateSubmit={async (event) => {
          event.preventDefault();
          await apiFetch('/shared-profiles', {
            method: 'POST',
            body: JSON.stringify({
              ...createForm,
              expirationDate: new Date(createForm.expirationDate).toISOString()
            })
          });
          setCreateForm(initialCreateForm);
          await loadRows();
        }}
        renderForm={() => (
          <div className="grid gap-3">
            <Select
              value={createForm.candidateId}
              onValueChange={(value) => setCreateForm((prev) => ({ ...prev, candidateId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidateOptions.map((candidate) => (
                  <SelectItem key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Shared With Name"
              value={createForm.sharedWithName}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, sharedWithName: event.target.value }))
              }
              required
            />
            <Input
              type="email"
              placeholder="Shared With Email"
              value={createForm.sharedWithEmail}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, sharedWithEmail: event.target.value }))
              }
              required
            />
            <Input
              placeholder="Rate Label"
              value={createForm.rateLabel}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, rateLabel: event.target.value }))
              }
              required
            />
            <Input
              type="datetime-local"
              value={createForm.expirationDate}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, expirationDate: event.target.value }))
              }
              required
            />
          </div>
        )}
        getRowId={(row) => row.id}
      />

      {adjusting ? (
        <ResourceFormDialog
          open={Boolean(adjusting)}
          onOpenChange={(open) => {
            if (!open) setAdjusting(null);
          }}
          trigger={<span />}
          title="Adjust Shared Profile"
          submitLabel="Save"
          onSubmit={async (event) => {
            event.preventDefault();
            await apiFetch(`/shared-profiles/${adjusting.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                rateLabel: adjustForm.rateLabel,
                expirationDate: new Date(adjustForm.expirationDate).toISOString()
              })
            });
            setAdjusting(null);
            await loadRows();
          }}
        >
          <Input
            placeholder="Rate Label"
            value={adjustForm.rateLabel}
            onChange={(event) => setAdjustForm((prev) => ({ ...prev, rateLabel: event.target.value }))}
            required
          />
          <Input
            type="datetime-local"
            value={adjustForm.expirationDate}
            onChange={(event) =>
              setAdjustForm((prev) => ({ ...prev, expirationDate: event.target.value }))
            }
            required
          />
        </ResourceFormDialog>
      ) : null}
    </div>
  );
}
