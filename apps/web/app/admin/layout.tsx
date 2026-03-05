import { AppFrame } from '@repo/ui/patterns/app-frame';
import Link from 'next/link';
import { ReactNode } from 'react';
import { SignOutButton } from '../../components/sign-out-button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppFrame
      sidebar={
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Chromedia</p>
            <h2 className="mt-1 text-lg font-semibold">Talent Intelligence</h2>
          </div>

          <nav className="space-y-2 text-sm text-slate-600">
            <Link href="/admin/dashboard" className="block hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/admin/candidates" className="block hover:text-slate-900">
              Candidates
            </Link>
            <Link href="/admin/skills" className="block hover:text-slate-900">
              Skills
            </Link>
            <Link href="/admin/shared-profiles" className="block hover:text-slate-900">
              Shared Profiles
            </Link>
            <span className="block opacity-60">QA Test Cases</span>
            <span className="block opacity-60">Settings</span>
          </nav>
        </div>
      }
      topNav={
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">Admin Console</p>
          <SignOutButton />
        </div>
      }
    >
      {children}
    </AppFrame>
  );
}
