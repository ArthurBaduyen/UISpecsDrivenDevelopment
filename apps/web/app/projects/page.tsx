'use client';

import { ResourceListPage } from '@repo/ui/blocks/resource-list-page';
import type { ResourceColumn } from '@repo/ui/blocks/resource-table';
import { PageLayout } from '@repo/ui/patterns/page-layout';
import { Input } from '@repo/ui/primitives/input';

type Project = {
  id: string;
  name: string;
  status: 'Active' | 'Draft' | 'Archived';
  owner: string;
};

const columns: Array<ResourceColumn<Project>> = [
  { key: 'name', header: 'Project' },
  { key: 'status', header: 'Status' },
  { key: 'owner', header: 'Owner' }
];

const rows: Project[] = [
  { id: 'prj_001', name: 'Growth Analytics', status: 'Active', owner: 'Alex' },
  { id: 'prj_002', name: 'Billing Revamp', status: 'Draft', owner: 'Rina' },
  { id: 'prj_003', name: 'Tenant Migration', status: 'Archived', owner: 'Marco' }
];

export default function ProjectsPage() {
  return (
    <PageLayout className="p-6">
      <ResourceListPage
        title="Projects"
        description="Manage project records with a shared CRUD list architecture."
        createLabel="Create Project"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        onSearch={() => undefined}
        renderForm={() => (
          <div className="space-y-3">
            <Input placeholder="Project name" />
            <Input placeholder="Owner" />
          </div>
        )}
      />
    </PageLayout>
  );
}
