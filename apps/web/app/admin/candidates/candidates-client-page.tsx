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
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Candidate,
  CandidateInviteLinkResponse,
  CandidateQueryResponse,
  apiFetch
} from '../../../lib/chromedia-api';

type CandidateFormState = {
  name: string;
  role: string;
  technologies: string;
  expectedSalary: string;
  available: string;
  status: 'Active' | 'Inactive' | 'Pending';
  email: string;
  phone: string;
};

const initialFormState: CandidateFormState = {
  name: '',
  role: '',
  technologies: '',
  expectedSalary: '',
  available: '',
  status: 'Pending',
  email: '',
  phone: ''
};

const statusOptions = ['All', 'Active', 'Pending', 'Inactive'] as const;
const sortOptions = [
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Oldest', value: 'createdAt:asc' },
  { label: 'Name (A-Z)', value: 'name:asc' },
  { label: 'Name (Z-A)', value: 'name:desc' },
  { label: 'Role (A-Z)', value: 'role:asc' },
  { label: 'Status', value: 'status:asc' }
] as const;

function statusVariant(status: Candidate['status']): 'default' | 'secondary' | 'outline' {
  if (status === 'Active') return 'default';
  if (status === 'Pending') return 'secondary';
  return 'outline';
}

export default function AdminCandidatesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? 'All');
  const [role, setRole] = useState(searchParams.get('role') ?? '');
  const [available, setAvailable] = useState(searchParams.get('available') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'createdAt:desc');

  const [createForm, setCreateForm] = useState<CandidateFormState>(initialFormState);
  const [editForm, setEditForm] = useState<CandidateFormState>(initialFormState);
  const [editing, setEditing] = useState<Candidate | null>(null);

  const syncUrl = (
    next: Partial<{
      q: string;
      status: string;
      role: string;
      available: string;
      sort: string;
    }>
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const merged = {
      q: next.q ?? query,
      status: next.status ?? status,
      role: next.role ?? role,
      available: next.available ?? available,
      sort: next.sort ?? sort
    };

    if (merged.q.trim()) params.set('q', merged.q.trim());
    else params.delete('q');
    if (merged.status !== 'All') params.set('status', merged.status);
    else params.delete('status');
    if (merged.role.trim()) params.set('role', merged.role.trim());
    else params.delete('role');
    if (merged.available.trim()) params.set('available', merged.available.trim());
    else params.delete('available');
    if (merged.sort !== 'createdAt:desc') params.set('sort', merged.sort);
    else params.delete('sort');

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  };

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortBy = 'createdAt', sortDir = 'desc'] = sort.split(':');
      const params = new URLSearchParams({
        page: '1',
        pageSize: '50',
        sortBy,
        sortDir
      });

      if (query.trim()) params.set('q', query.trim());
      if (status !== 'All') params.set('status', status);
      if (role.trim()) params.set('role', role.trim());
      if (available.trim()) params.set('available', available.trim());

      const response = await apiFetch<CandidateQueryResponse>(
        `/candidates/query?${params.toString()}`
      );
      setRows(response.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidates();
  }, [query, status, role, available, sort]);

  useEffect(() => {
    const nextQ = searchParams.get('q') ?? '';
    const nextStatus = searchParams.get('status') ?? 'All';
    const nextRole = searchParams.get('role') ?? '';
    const nextAvailable = searchParams.get('available') ?? '';
    const nextSort = searchParams.get('sort') ?? 'createdAt:desc';
    setQuery(nextQ);
    setStatus(nextStatus);
    setRole(nextRole);
    setAvailable(nextAvailable);
    setSort(nextSort);
  }, [searchParams]);

  const columns = useMemo<Array<ResourceColumn<Candidate>>>(
    () => [
      {
        key: 'name',
        header: 'Candidate Name',
        render: (row) => (
          <Link href={`/admin/candidates/${row.id}`} className="font-medium hover:underline">
            {row.name}
          </Link>
        )
      },
      { key: 'role', header: 'Role' },
      { key: 'technologies', header: 'Technologies' },
      { key: 'expectedSalary', header: 'Expected Salary' },
      { key: 'available', header: 'Available' },
      {
        key: 'status',
        header: 'Status',
        render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(row);
                setEditForm({
                  name: row.name,
                  role: row.role,
                  technologies: row.technologies,
                  expectedSalary: row.expectedSalary,
                  available: row.available,
                  status: row.status,
                  email: row.email ?? '',
                  phone: row.phone ?? ''
                });
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const invite = await apiFetch<CandidateInviteLinkResponse>('/candidate-links', {
                  method: 'POST',
                  body: JSON.stringify({ candidateId: row.id })
                });
                window.open(`/candidate/${invite.token}/start`, '_blank', 'noopener,noreferrer');
              }}
            >
              Candidate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const previewUrl = `${window.location.origin}/customer/candidates/${row.id}/preview`;
                try {
                  await navigator.clipboard.writeText(previewUrl);
                  window.alert('Preview link copied.');
                } catch {
                  window.prompt('Copy this preview link:', previewUrl);
                }
              }}
            >
              Copy Link
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                if (!window.confirm('Remove Candidate?')) return;
                await apiFetch<void>(`/candidates/${row.id}`, { method: 'DELETE' });
                await loadCandidates();
              }}
            >
              Remove
            </Button>
          </div>
        )
      }
    ],
    [query, status, role, available, sort]
  );

  const formFields = (form: CandidateFormState, setForm: (value: CandidateFormState) => void) => (
    <div className="grid gap-3">
      <Input
        placeholder="Candidate name"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        required
      />
      <Input
        placeholder="Role"
        value={form.role}
        onChange={(event) => setForm({ ...form, role: event.target.value })}
        required
      />
      <Input
        placeholder="Technologies"
        value={form.technologies}
        onChange={(event) => setForm({ ...form, technologies: event.target.value })}
        required
      />
      <Input
        placeholder="Expected salary"
        value={form.expectedSalary}
        onChange={(event) => setForm({ ...form, expectedSalary: event.target.value })}
        required
      />
      <Input
        placeholder="Availability"
        value={form.available}
        onChange={(event) => setForm({ ...form, available: event.target.value })}
        required
      />
      <Input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
      />
      <Input
        placeholder="Phone"
        value={form.phone}
        onChange={(event) => setForm({ ...form, phone: event.target.value })}
      />
      <Select
        value={form.status}
        onValueChange={(value) => setForm({ ...form, status: value as CandidateFormState['status'] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <ResourceListPage
        title="Candidates"
        description="Search, filter, and manage candidate records."
        createLabel="Add Candidate"
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRetry={() => loadCandidates()}
        onSearch={(value) => {
          setQuery(value);
          syncUrl({ q: value });
        }}
        searchValue={query}
        onFilter={
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                syncUrl({ status: value });
              }}
            >
              <SelectTrigger className="w-[140px]">
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

            <Input
              className="w-[170px]"
              placeholder="Role filter"
              value={role}
              onChange={(event) => {
                const value = event.target.value;
                setRole(value);
                syncUrl({ role: value });
              }}
            />

            <Input
              className="w-[170px]"
              placeholder="Availability"
              value={available}
              onChange={(event) => {
                const value = event.target.value;
                setAvailable(value);
                syncUrl({ available: value });
              }}
            />

            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                syncUrl({ sort: value });
              }}
            >
              <SelectTrigger className="w-[170px]">
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
          await apiFetch<Candidate>('/candidates', {
            method: 'POST',
            body: JSON.stringify(createForm)
          });
          setCreateForm(initialFormState);
          await loadCandidates();
        }}
        renderForm={() => formFields(createForm, setCreateForm)}
        getRowId={(row) => row.id}
      />

      {editing ? (
        <ResourceFormDialog
          open={Boolean(editing)}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
          trigger={<span />}
          title="Edit Candidate"
          submitLabel="Save"
          onSubmit={async (event) => {
            event.preventDefault();
            await apiFetch<Candidate>(`/candidates/${editing.id}`, {
              method: 'PUT',
              body: JSON.stringify(editForm)
            });
            setEditing(null);
            await loadCandidates();
          }}
        >
          {formFields(editForm, setEditForm)}
        </ResourceFormDialog>
      ) : null}
    </div>
  );
}
