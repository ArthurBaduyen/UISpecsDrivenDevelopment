import { AppFrame } from '@repo/ui/patterns/app-frame';
import { PageHeader } from '@repo/ui/patterns/page-header';
import { Section } from '@repo/ui/patterns/section';
import { StatsRow } from '@repo/ui/blocks/stats-row';
import { Button } from '@repo/ui/primitives/button';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';

const statItems = [
  { label: 'Total Projects', value: 12, trend: '+2 this month' },
  { label: 'Active Projects', value: 7, trend: '+1 this week' },
  { label: 'Team Members', value: 18, trend: 'Stable' },
  { label: 'Errors (24h)', value: 3, trend: '-40% vs yesterday' }
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <AppFrame
      sidebar={
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
            <h2 className="mt-1 text-lg font-semibold">SaaS Console</h2>
          </div>
          <nav className="space-y-2 text-sm">
            <p className="font-medium text-slate-900 dark:text-slate-100">Dashboard</p>
            <Link
              href="/projects"
              className="block text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Projects
            </Link>
            <p className="text-slate-500">Members</p>
            <p className="text-slate-500">Billing</p>
          </nav>
        </div>
      }
      topNav={
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Signed in as {session.user?.email}
          </p>
          <Button variant="outline" size="sm">
            Switch Organization
          </Button>
        </div>
      }
    >
      <PageHeader
        title="Dashboard"
        description="High-level tenant health and usage metrics."
        actions={
          <Button asChild>
            <Link href="/projects">Manage Projects</Link>
          </Button>
        }
      />

      <StatsRow items={statItems} />

      <Section title="Activity" description="Recent operational summary for your organization.">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>3 deployments completed in the last 24 hours.</li>
          <li>All API health checks are passing.</li>
          <li>Next billing cycle starts in 9 days.</li>
        </ul>
      </Section>
    </AppFrame>
  );
}
