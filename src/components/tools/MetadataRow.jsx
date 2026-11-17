import CopyButton from "@/components/common/CopyButton";
import RemoteImage from "@/components/common/RemoteImage";

// One metadata field: name on the left, value (or "Not found") on the right.
export default function MetadataRow({ row }) {
  const isUrl = /^https?:\/\/\S+$/i.test(row.value);
  const isImage =
    row.found && isUrl && /image/i.test(row.key) && !/(width|height|alt|type)$/i.test(row.key);
  const multiline = row.value.includes("\n");

  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
      <dt className="break-all font-mono text-xs text-muted-foreground sm:pt-1">{row.label}</dt>
      <dd className="flex min-w-0 items-start justify-between gap-2 text-sm">
        <div className="min-w-0">
          {!row.found ? (
            <span className="italic text-muted-foreground">
              {row.expected ? "Not found" : "Empty"}
            </span>
          ) : isUrl ? (
            <a
              href={row.value}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-mono text-primary hover:underline"
            >
              {row.value}
            </a>
          ) : multiline ? (
            <pre className="overflow-x-auto rounded-md bg-muted/60 p-2 font-mono text-xs">{row.value}</pre>
          ) : (
            <span className="break-words">{row.value}</span>
          )}
          {isImage && (
            <RemoteImage
              src={row.value}
              className="mt-2 max-h-28 rounded-md border border-border object-cover"
            />
          )}
        </div>
        {row.found && <CopyButton value={row.value} ariaLabel={`Copy ${row.label}`} />}
      </dd>
    </div>
  );
}
