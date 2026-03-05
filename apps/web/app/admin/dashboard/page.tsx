'use client';

import { StatsRow } from '@repo/ui/blocks/stats-row';
import { PageHeader } from '@repo/ui/patterns/page-header';
import { Section } from '@repo/ui/patterns/section';
import { useEffect, useState } from 'react';
import { Candidate, CandidateQueryResponse, apiFetch } from '../../../lib/chromedia-api';

export default function AdminDashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    void (async () => {
      const data = await apiFetch<CandidateQueryResponse>('/candidates/query?page=1&pageSize=100');
      setCandidates(data.items);
    })();
  }, []);

  const active = candidates.filter((candidate) => candidate.status === 'Active').length;
  const pending = candidates.filter((candidate) => candidate.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="At-a-glance operations metrics for candidates." />

      <StatsRow
        items={[
          { label: 'Total Candidates', value: candidates.length },
          { label: 'Active', value: active },
          { label: 'Pending', value: pending },
          {
            label: 'Completion Proxy',
            value: `${candidates.length ? Math.round((active / candidates.length) * 100) : 0}%`
          }
        ]}
      />

      <Section
        title="Slice 1 Scope"
        description="Dashboard is intentionally minimal in the first vertical slice."
      >
        <p className="text-sm text-slate-600">
          Next slices will add funnel analytics, shared-profile performance, and role-gap tables
          from specs.
        </p>
      </Section>
    </div>
  );
}
