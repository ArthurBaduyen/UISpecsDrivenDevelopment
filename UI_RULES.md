# UI Rules

## Golden Example: Dashboard Composition

```tsx
import { AppFrame } from '@repo/ui/patterns/app-frame';
import { PageHeader } from '@repo/ui/patterns/page-header';
import { Section } from '@repo/ui/patterns/section';
import { StatsRow } from '@repo/ui/blocks/stats-row';

<AppFrame sidebar={<Sidebar />} topNav={<TopNav />}>
  <PageHeader title="Dashboard" description="Tenant overview" />
  <StatsRow items={stats} />
  <Section title="Activity">...</Section>
</AppFrame>;
```

## Golden Example: CRUD List Page

```tsx
import { ResourceListPage } from '@repo/ui/blocks/resource-list-page';
import type { ResourceColumn } from '@repo/ui/blocks/resource-table';

const columns: Array<ResourceColumn<Project>> = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' }
];

<ResourceListPage
  title="Projects"
  description="Manage project records"
  createLabel="Create Project"
  columns={columns}
  rows={rows}
  loading={loading}
  error={error}
  renderForm={() => <ProjectForm />}
/>;
```

## Golden Example: Create/Edit Dialog Form

```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResourceFormDialog } from '@repo/ui/blocks/resource-form-dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@repo/ui/primitives/form';
import { Input } from '@repo/ui/primitives/input';

const schema = z.object({ name: z.string().min(2) });

const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: '' } });

<ResourceFormDialog trigger={<button>Create</button>} title="Create Project">
  <Form {...form}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </Form>
</ResourceFormDialog>;
```

## Allowed Components (Top 20)

1. `Button` - `@repo/ui/primitives/button`
2. `Card` - `@repo/ui/primitives/card`
3. `Dialog` - `@repo/ui/primitives/dialog`
4. `Input` - `@repo/ui/primitives/input`
5. `Form` - `@repo/ui/primitives/form`
6. `Table` - `@repo/ui/primitives/table`
7. `DropdownMenu` - `@repo/ui/primitives/dropdown-menu`
8. `Tabs` - `@repo/ui/primitives/tabs`
9. `Badge` - `@repo/ui/primitives/badge`
10. `Select` - `@repo/ui/primitives/select`
11. `Checkbox` - `@repo/ui/primitives/checkbox`
12. `Skeleton` - `@repo/ui/primitives/skeleton`
13. `AppFrame` - `@repo/ui/patterns/app-frame`
14. `PageHeader` - `@repo/ui/patterns/page-header`
15. `Toolbar` - `@repo/ui/patterns/toolbar`
16. `Section` - `@repo/ui/patterns/section`
17. `EmptyState` - `@repo/ui/patterns/empty-state`
18. `ResourceTable` - `@repo/ui/blocks/resource-table`
19. `ResourceFormDialog` - `@repo/ui/blocks/resource-form-dialog`
20. `ResourceListPage` - `@repo/ui/blocks/resource-list-page`
