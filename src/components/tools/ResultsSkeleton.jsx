import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ResultsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Extracting metadata">
      <Skeleton className="h-6 w-40" />
      {[0, 1].map((i) => (
        <Card key={i} className="space-y-4 p-5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      ))}
    </div>
  );
}
