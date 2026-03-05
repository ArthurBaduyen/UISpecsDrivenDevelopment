import type { ResourceColumn } from './resource-table';
import { ResourceTable } from './resource-table';

export type DataColumn<T> = ResourceColumn<T>;

type DataTableProps<T> = {
  columns: Array<DataColumn<T>>;
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  getRowId?: (row: T, index: number) => string;
};

export function DataTable<T extends Record<string, unknown>>(props: DataTableProps<T>) {
  return <ResourceTable {...props} />;
}
