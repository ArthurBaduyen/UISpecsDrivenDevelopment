import type { StatCardProps } from './stat-card';
import { StatCard } from './stat-card';

type StatsRowProps = {
  items: StatCardProps[];
};

export function StatsRow({ items }: StatsRowProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <StatCard key={`${item.label}-${index}`} {...item} />
      ))}
    </div>
  );
}
