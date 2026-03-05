'use client';

import { ResourceTable } from '@repo/ui/blocks/resource-table';
import { StatCard } from '@repo/ui/blocks/stat-card';
import { EmptyState } from '@repo/ui/patterns/empty-state';
import { PageHeader } from '@repo/ui/patterns/page-header';
import { Section } from '@repo/ui/patterns/section';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardSummaryResponse, apiFetch } from '../../../lib/chromedia-api';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await apiFetch<DashboardSummaryResponse>('/dashboard/summary');
        setSummary(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard');
      }
    })();
  }, []);

  if (error) {
    return (
      <Section title="Dashboard" description="At a Glance">
        <EmptyState title="Dashboard unavailable" description={error} />
      </Section>
    );
  }

  if (!summary) {
    return (
      <Section title="Dashboard" description="At a Glance">
        <p className="text-sm text-slate-600">Loading dashboard data...</p>
      </Section>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="At a Glance metrics for the admin team." />

      <Section title="At a Glance" description="Click cards to navigate to filtered candidate lists.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/admin/candidates">
            <StatCard label="Total Candidates" value={summary.kpis.total} />
          </Link>
          <Link href="/admin/candidates?status=Active">
            <StatCard label="Active" value={summary.kpis.active} />
          </Link>
          <Link href="/admin/candidates?status=Pending">
            <StatCard label="Pending" value={summary.kpis.pending} />
          </Link>
          <Link href="/admin/candidates?status=Inactive">
            <StatCard
              label="Profile Completeness"
              value={`${summary.profileCompleteness.rate}%`}
              trend={`${summary.profileCompleteness.complete} complete`}
            />
          </Link>
        </div>
      </Section>

      <Section title="Week-over-Week" description="Candidate records created in the last two weeks.">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Current Week" value={summary.weekOverWeek.current} />
          <StatCard label="Previous Week" value={summary.weekOverWeek.previous} />
          <StatCard
            label="Delta"
            value={summary.weekOverWeek.delta}
            trend={summary.weekOverWeek.delta >= 0 ? 'Increase' : 'Decrease'}
          />
        </div>
      </Section>

      <Section title="Candidate Funnel" description="Current high-level candidate stage counts.">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Sourced" value={summary.funnel.sourced} />
          <StatCard label="Active" value={summary.funnel.active} />
          <StatCard label="Pending" value={summary.funnel.pending} />
        </div>
      </Section>

      <Section
        title="Role Demand vs Availability"
        description="Most represented roles based on available candidate records."
      >
        <ResourceTable
          columns={[
            { key: 'role', header: 'Role' },
            { key: 'count', header: 'Candidates' }
          ]}
          rows={summary.roleDemandVsAvailability}
          emptyTitle="No role data yet"
          emptyDescription="Add candidates to populate role metrics."
        />
      </Section>
    </div>
  );
}
