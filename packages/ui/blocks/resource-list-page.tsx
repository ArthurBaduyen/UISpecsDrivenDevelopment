'use client';

import type { ReactNode } from 'react';
import { Button } from '../primitives/button';
import { PageHeader } from '../patterns/page-header';
import { Section } from '../patterns/section';
import { Toolbar } from '../patterns/toolbar';
import type { ResourceColumn } from './resource-table';
import { ResourceFormDialog } from './resource-form-dialog';
import { ResourceTable } from './resource-table';

type ResourceListPageProps<T extends Record<string, unknown>> = {
  title: string;
  description?: string;
  createLabel?: string;
  columns: Array<ResourceColumn<T>>;
  rows: T[];
  loading?: boolean;
  error?: string | null;
  onCreate?: () => void;
  onUpdate?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRetry?: () => void;
  onSearch?: (query: string) => void;
  onFilter?: ReactNode;
  renderForm?: () => ReactNode;
  getRowId?: (row: T, index: number) => string;
};

export function ResourceListPage<T extends Record<string, unknown>>({
  title,
  description,
  createLabel = 'Create',
  columns,
  rows,
  loading,
  error,
  onCreate,
  onUpdate,
  onDelete,
  onRetry,
  onSearch,
  onFilter,
  renderForm,
  getRowId
}: ResourceListPageProps<T>) {
  void onUpdate;
  void onDelete;

  const createTrigger = <Button>{createLabel}</Button>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          renderForm ? (
            <ResourceFormDialog trigger={createTrigger} title={createLabel} onSubmit={(event) => event.preventDefault()}>
              {renderForm()}
            </ResourceFormDialog>
          ) : (
            <Button onClick={onCreate}>{createLabel}</Button>
          )
        }
      />

      <Toolbar
        left={
          <div className="flex items-center gap-2">
            {onSearch ? (
              <input
                type="search"
                placeholder="Search..."
                className="h-9 w-56 rounded-md border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                onChange={(event) => onSearch(event.target.value)}
              />
            ) : null}
            {onFilter}
          </div>
        }
        right={null}
      />

      <Section>
        <ResourceTable
          columns={columns}
          rows={rows}
          loading={loading}
          error={error}
          onRetry={onRetry}
          getRowId={getRowId}
        />
      </Section>
    </div>
  );
}
