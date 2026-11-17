import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/common/StatusBadge";

export default function ToolCard({ library }) {
  const Icon = library.icon;
  const available = library.status === "available";
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-muted text-primary">
            <Icon className="size-5" />
          </div>
          <StatusBadge status={library.status} />
        </div>
        <h3 className="mt-4 font-semibold">{library.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{library.shortDescription}</p>
        <Link
          to={library.toolPath}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {available ? "Open tool" : "View status"}
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
