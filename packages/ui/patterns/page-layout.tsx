import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function PageLayout({ children, className }: PageLayoutProps) {
  return <div className={cn('mx-auto w-full max-w-7xl space-y-6', className)}>{children}</div>;
}
