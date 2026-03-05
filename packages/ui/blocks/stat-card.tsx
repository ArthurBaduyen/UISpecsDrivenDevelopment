import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/card';

export type StatCardProps = {
  label: string;
  value: string | number;
  trend?: string;
  icon?: ReactNode;
};

export function StatCard({ label, value, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</CardTitle>
        {icon ? <span className="text-slate-500">{icon}</span> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend ? <p className="text-xs text-slate-500 dark:text-slate-400">{trend}</p> : null}
      </CardContent>
    </Card>
  );
}
