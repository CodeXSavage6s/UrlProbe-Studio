import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPanel({ title, message, hint, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/40 bg-destructive/10 p-5"
    >
      <div className="flex gap-3">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="min-w-0">
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 break-words text-sm text-foreground/90">{message}</p>
          {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
          {onRetry && (
            <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
