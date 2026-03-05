import type { ReactNode } from 'react';

type ErrorStateProps = {
  title?: string;
  message: string;
  icon?: ReactNode;
  retry?: ReactNode;
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  icon,
  retry
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
      {icon ? <div className="mb-2 text-red-600">{icon}</div> : null}
      <h3 className="text-base font-semibold text-red-900 dark:text-red-200">{title}</h3>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
      {retry ? <div className="mt-4">{retry}</div> : null}
    </div>
  );
}
