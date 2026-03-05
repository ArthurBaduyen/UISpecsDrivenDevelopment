import { Section } from '@repo/ui/patterns/section';
import { Suspense } from 'react';
import AdminCandidatesClientPage from './candidates-client-page';

export default function AdminCandidatesPage() {
  return (
    <Suspense
      fallback={
        <Section title="Candidates" description="Loading candidate management view...">
          <p className="text-sm text-slate-600">Please wait.</p>
        </Section>
      }
    >
      <AdminCandidatesClientPage />
    </Suspense>
  );
}
