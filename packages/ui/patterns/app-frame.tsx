import type { ReactNode } from 'react';
import { AppShell } from './app-shell';

type AppFrameProps = {
  sidebar: ReactNode;
  topNav?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AppFrame(props: AppFrameProps) {
  return <AppShell {...props} />;
}
