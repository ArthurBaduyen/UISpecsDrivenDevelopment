'use client';

import { ResourceFormDialog } from '@repo/ui/blocks/resource-form-dialog';
import { ResourceListPage } from '@repo/ui/blocks/resource-list-page';
import type { ResourceColumn } from '@repo/ui/blocks/resource-table';
import { Button } from '@repo/ui/primitives/button';
import { Input } from '@repo/ui/primitives/input';
import { useEffect, useMemo, useState } from 'react';
import { Candidate, CandidateQueryResponse, apiFetch } from '../../../lib/chromedia-api';

type CandidateFormState = {
  name: string;
  role: string;
  technologies: string;
  expectedSalary: string;
  available: string;
  status: 'Active' | 'Inactive' | 'Pending';
  email: string;
};

const initialFormState: CandidateFormState = {
  name: '',
  role: '',
  technologies: '',
  expectedSalary: '',
  available: '',
  status: 'Pending',
  email: ''
};

export default function AdminCandidatesPage() {
  const [rows, setRows] = useState<Candidate[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CandidateFormState>(initialFormState);
  const [editForm, setEditForm] = useState<CandidateFormState>(initialFormState);
  const [editing, setEditing] = useState<Candidate | null>(null);

  const loadCandidates = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: '1', pageSize: '50' });
      if (search) {
        params.set('q', search);
      }

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
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadCandidates(query);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const columns = useMemo<Array<ResourceColumn<Candidate>>>(
    () => [
      { key: 'name', header: 'Candidate Name' },
      { key: 'role', header: 'Role' },
      { key: 'technologies', header: 'Technologies' },
      { key: 'expectedSalary', header: 'Expected Salary' },
      { key: 'available', header: 'Available' },
      { key: 'status', header: 'Status' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
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
                  email: row.email ?? ''
                });
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                if (!window.confirm('Remove Candidate?')) return;
                await apiFetch<void>(`/candidates/${row.id}`, { method: 'DELETE' });
                await loadCandidates(query);
              }}
            >
              Remove
            </Button>
          </div>
        )
      }
    ],
    [query]
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
        placeholder="Available"
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
      <select
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
        value={form.status}
        onChange={(event) =>
          setForm({ ...form, status: event.target.value as CandidateFormState['status'] })
        }
      >
        <option value="Pending">Pending</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <ResourceListPage
        title="Candidates"
        description="Manage candidate records and admin actions."
        createLabel="Add Candidate"
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRetry={() => loadCandidates(query)}
        onSearch={(value) => setQuery(value)}
        onCreateSubmit={async (event) => {
          event.preventDefault();
          await apiFetch<Candidate>('/candidates', {
            method: 'POST',
            body: JSON.stringify(createForm)
          });
          setCreateForm(initialFormState);
          await loadCandidates(query);
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
            await loadCandidates(query);
          }}
        >
          {formFields(editForm, setEditForm)}
        </ResourceFormDialog>
      ) : null}
    </div>
  );
}
