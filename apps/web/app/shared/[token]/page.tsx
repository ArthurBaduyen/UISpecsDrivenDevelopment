'use client';

import { Section } from '@repo/ui/patterns/section';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Candidate, SharedProfile, apiFetch } from '../../../lib/chromedia-api';

export default function SharedProfilePage() {
  const params = useParams<{ token: string }>();
  const [sharedProfile, setSharedProfile] = useState<SharedProfile | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [share, candidateData] = await Promise.all([
          apiFetch<SharedProfile>(`/public-shares/${params.token}`),
          apiFetch<Candidate>(`/public-shares/${params.token}/candidate`)
        ]);
        setSharedProfile(share);
        setCandidate(candidateData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Link unavailable');
      }
    })();
  }, [params.token]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Section title="Link unavailable" description={error}>
          <p className="text-sm text-slate-600">
            This shared profile link is invalid, removed, or expired.
          </p>
        </Section>
      </main>
    );
  }

  if (!sharedProfile || !candidate) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Section title="Loading shared profile..." description="Please wait.">
          <p className="text-sm text-slate-600">Fetching shared profile details.</p>
        </Section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <Section
        title={sharedProfile.candidateName}
        description={`Shared with ${sharedProfile.sharedWithName} • ${sharedProfile.rateLabel}`}
      >
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Role:</span> {candidate.role}
          </p>
          <p>
            <span className="font-medium">Technologies:</span> {candidate.technologies}
          </p>
          <p>
            <span className="font-medium">Availability:</span> {candidate.available}
          </p>
          <p>
            <span className="font-medium">Expected Salary:</span> {candidate.expectedSalary}
          </p>
        </div>
      </Section>
    </main>
  );
}
