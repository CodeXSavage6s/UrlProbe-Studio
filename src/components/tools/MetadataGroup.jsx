import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetadataRow from "@/components/tools/MetadataRow";

export default function MetadataGroup({ group }) {
  const total = group.rows.length;
  const found = group.rows.filter((row) => row.found).length;
  const summary =
    group.id === "other" ? `${total} field${total === 1 ? "" : "s"}` : `${found} of ${total} found`;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{group.title}</CardTitle>
            <CardDescription className="mt-1.5">{group.description}</CardDescription>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">{summary}</span>
        </div>
      </CardHeader>
      <dl className="divide-y divide-border border-t border-border">
        {group.rows.map((row) => (
          <MetadataRow key={row.key} row={row} />
        ))}
      </dl>
    </Card>
  );
}
