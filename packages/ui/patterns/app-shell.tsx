import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type AppShellProps = {
  sidebar: ReactNode;
  topNav?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AppShell({ sidebar, topNav, children, className }: AppShellProps) {
  return (
    <div className={cn('min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100', className)}>
      <div className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">{sidebar}</aside>
        <div className="flex min-h-screen flex-col">
          {topNav ? (
            <header className="border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
              {topNav}
            </header>
          ) : null}
          <main className="flex-1 space-y-6 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
