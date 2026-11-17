import { useState } from "react";
import { FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/common/CopyButton";
import EmptyState from "@/components/common/EmptyState";
import MetadataGroup from "@/components/tools/MetadataGroup";
import SocialPreview from "@/components/tools/SocialPreview";
import { getSocialPreview, hasAnyMetadata } from "@/utils/metadata";

export default function MetadataResults({ url, raw, groups }) {
  const [showRaw, setShowRaw] = useState(false);
  const preview = getSocialPreview(groups);
  const json = JSON.stringify(raw, null, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Results</h2>
          <p className="truncate font-mono text-sm text-muted-foreground">{url}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRaw((v) => !v)} aria-pressed={showRaw}>
            <FileJson className="size-4" />
            {showRaw ? "Hide raw response" : "Raw response"}
          </Button>
          <CopyButton value={json} variant="outline" size="sm" ariaLabel="Copy all as JSON">
            Copy JSON
          </CopyButton>
        </div>
      </div>

      {showRaw && (
        <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-card p-4 font-mono text-xs">
          {json}
        </pre>
      )}

      {!hasAnyMetadata(groups) && (
        <EmptyState
          icon={FileJson}
          title="No metadata found"
          description="The API responded, but none of the expected fields were present. Check the raw response to see exactly what came back."
        />
      )}

      {preview && <SocialPreview preview={preview} requestedUrl={url} />}

      {groups.map((group) => (
        <MetadataGroup key={group.id} group={group} />
      ))}
    </div>
  );
}
