import { Card } from "@/components/ui/card";
import RemoteImage from "@/components/common/RemoteImage";

function hostOf(...candidates) {
  for (const candidate of candidates) {
    try {
      if (candidate) return new URL(candidate).hostname;
    } catch {
      // try the next candidate
    }
  }
  return "";
}

// How the page may look when its link is shared (built from Open Graph / Twitter data).
export default function SocialPreview({ preview, requestedUrl }) {
  const host = hostOf(preview.url, requestedUrl);
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">Link preview</h3>
      <Card className="max-w-md overflow-hidden">
        {preview.image && (
          <RemoteImage
            src={preview.image}
            className="aspect-[1.91/1] w-full border-b border-border bg-muted object-cover"
            fallback={
              <div className="flex aspect-[1.91/1] w-full items-center justify-center border-b border-border bg-muted text-xs text-muted-foreground">
                Preview image could not be loaded
              </div>
            }
          />
        )}
        <div className="space-y-1 p-4">
          {host && <p className="font-mono text-xs text-muted-foreground">{host}</p>}
          {preview.title && <p className="font-medium leading-snug">{preview.title}</p>}
          {preview.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{preview.description}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
