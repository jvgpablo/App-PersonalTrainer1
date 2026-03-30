import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-background-tertiary", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-background-secondary border border-border rounded-2xl p-4 mb-3">
      <Skeleton className="h-4 w-3/5 mb-2" />
      <Skeleton className="h-3 w-4/5 mb-1" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return <>{Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}</>;
}
