import { Code, ExternalLink, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/common/StatusBadge";

function LinkRow({ icon: Icon, label, href, fallback }) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <Icon className="size-4" />
        {label}
        <ExternalLink className="size-3" />
      </a>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4" />
      {label}: {fallback}
    </span>
  );
}

export default function LibraryCard({ library }) {
  const Icon = library.icon;
  const pypiFallback = library.pypiStatus === "coming-soon" ? "Coming soon" : "Not linked yet";
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-muted text-primary">
              <Icon className="size-5" />
            </div>
            <h3 className="font-semibold">{library.name}</h3>
          </div>
          <StatusBadge status={library.status} />
        </div>
        <p className="mt-4 flex-1 text-sm text-muted-foreground">{library.description}</p>
        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4">
          <LinkRow icon={Code} label="GitHub" href={library.github} fallback="Not linked yet" />
          <LinkRow icon={Package} label="PyPI" href={library.pypi} fallback={pypiFallback} />
        </div>
      </CardContent>
    </Card>
  );
}
