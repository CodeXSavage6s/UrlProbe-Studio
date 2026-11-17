import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import SectionHeading from "@/components/common/SectionHeading";
import { useActivity } from "@/hooks/useActivity";
import { LIBRARIES } from "@/config/ecosystem";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/lib/utils";

function entryLink(entry) {
  const library = LIBRARIES.find((l) => l.name === entry.tool);
  const path = library?.probePath ?? library?.toolPath ?? "/";
  return `${path}?url=${encodeURIComponent(entry.url)}`;
}

export default function RecentActivity() {
  const { items, clear } = useActivity();

  return (
    <section aria-labelledby="recent-heading">
      <SectionHeading
        id="recent-heading"
        title="Recent activity"
        description="Requests made from this browser. Select one to run it again."
        action={
          items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
          )
        }
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests yet"
          description="Probe a URL above and it will appear here. History stays in this browser."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {items.map((entry) => (
              <li key={entry.id}>
                <Link
                  to={entryLink(entry)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                >
                  <span
                    className={cn("size-2 shrink-0 rounded-full", entry.ok ? "bg-success" : "bg-destructive")}
                    aria-hidden="true"
                  />
                  <span className="sr-only">{entry.ok ? "Succeeded:" : "Failed:"}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-sm">{entry.url}</span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">{entry.tool}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(entry.at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}
