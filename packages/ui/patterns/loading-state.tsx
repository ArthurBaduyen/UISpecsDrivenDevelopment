import { Skeleton } from '../primitives/skeleton';

type LoadingStateProps = {
  lines?: number;
};

export function LoadingState({ lines = 4 }: LoadingStateProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}
