import { Section } from '@repo/ui/patterns/section';
import { Suspense } from 'react';
import AdminSharedProfilesClientPage from './shared-profiles-client-page';

export default function AdminSharedProfilesPage() {
  return (
    <Suspense
      fallback={
        <Section title="Shared Profiles" description="Loading shared profile management view...">
          <p className="text-sm text-slate-600">Please wait.</p>
        </Section>
      }
    >
      <AdminSharedProfilesClientPage />
    </Suspense>
  );
}
