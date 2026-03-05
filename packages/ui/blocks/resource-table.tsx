import type { ReactNode } from 'react';
import { Button } from '../primitives/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../primitives/table';
import { EmptyState } from '../patterns/empty-state';
import { ErrorState } from '../patterns/error-state';
import { LoadingState } from '../patterns/loading-state';

export type ResourceColumn<T> = {
  key: keyof T | string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  className?: string;
};

type ResourceTableProps<T> = {
  columns: Array<ResourceColumn<T>>;
  rows: T[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  getRowId?: (row: T, index: number) => string;
};

export function ResourceTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading = false,
  error,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription = 'Create a new record to get started.',
  getRowId
}: ResourceTableProps<T>) {
  if (loading) {
    return <LoadingState lines={5} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        retry={
          onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
          ) : null
        }
      />
    );
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => {
          const key = getRowId?.(row, index) ?? `${index}`;
          return (
            <TableRow key={key}>
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
