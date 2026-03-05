'use client';

import { Badge } from '@repo/ui/primitives/badge';
import { Button } from '@repo/ui/primitives/button';
import { PageHeader } from '@repo/ui/patterns/page-header';
import { Section } from '@repo/ui/patterns/section';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Candidate, apiFetch } from '../../../../lib/chromedia-api';

export default function AdminCandidateDetailPage() {
  const params = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await apiFetch<Candidate>(`/candidates/${params.id}`);
        setCandidate(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load candidate');
      }
    })();
  }, [params.id]);

  if (error) {
    return (
      <Section title="Candidate" description="Unable to load candidate record.">
        <p className="text-sm text-red-600">{error}</p>
      </Section>
    );
  }

  if (!candidate) {
    return (
      <Section title="Candidate" description="Loading candidate profile...">
        <p className="text-sm text-slate-600">Please wait.</p>
      </Section>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={candidate.name}
        description={candidate.role}
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/candidates">Back to Candidates</Link>
          </Button>
        }
      />

      <Section title="Profile">
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <p>
            <span className="font-medium">Technologies:</span> {candidate.technologies}
          </p>
          <p>
            <span className="font-medium">Expected Salary:</span> {candidate.expectedSalary}
          </p>
          <p>
            <span className="font-medium">Availability:</span> {candidate.available}
          </p>
          <p>
            <span className="font-medium">Email:</span> {candidate.email ?? 'N/A'}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {candidate.phone ?? 'N/A'}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge variant={candidate.status === 'Active' ? 'default' : 'secondary'}>
              {candidate.status}
            </Badge>
          </p>
        </div>
      </Section>
    </div>
  );
}
