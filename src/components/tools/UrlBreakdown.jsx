import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/common/CopyButton";

// One color per URL part, used for the line at the top and the table rows.
const PARTS = {
  scheme: { label: "Scheme", text: "text-primary", swatch: "bg-primary" },
  userinfo: { label: "Credentials", text: "text-destructive", swatch: "bg-destructive" },
  host: { label: "Host", text: "text-foreground", swatch: "bg-foreground" },
  port: { label: "Port", text: "text-warning", swatch: "bg-warning" },
  path: { label: "Path", text: "text-success", swatch: "bg-success" },
  query: { label: "Query", text: "text-violet-400", swatch: "bg-violet-400" },
  fragment: { label: "Fragment", text: "text-pink-400", swatch: "bg-pink-400" },
};

function Row({ part, label, value, note, copy = true, children }) {
  const style = part ? PARTS[part] : null;
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground sm:pt-0.5">
        {style && <span className={`size-2 shrink-0 rounded-sm ${style.swatch}`} aria-hidden="true" />}
        {label}
      </dt>
      <dd className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          {children ??
            (value ? (
              <span className="break-all font-mono text-sm">{value}</span>
            ) : (
              <span className="text-sm italic text-muted-foreground">None</span>
            ))}
          {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
        </div>
        {value && copy && <CopyButton value={value} ariaLabel={`Copy ${label}`} />}
      </dd>
    </div>
  );
}

export default function UrlBreakdown({ parsed }) {
  const present = [...new Set(parsed.pieces.map((piece) => piece.id))];
  const { domainParts } = parsed;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5 sm:p-6">
          <code className="block break-all font-mono text-base leading-relaxed sm:text-lg">
            {parsed.pieces.map((piece, index) => (
              <span key={`${piece.id}-${index}`} className={PARTS[piece.id].text}>
                {piece.text}
              </span>
            ))}
          </code>
          {parsed.schemeAssumed && (
            <p className="mt-3 text-xs text-muted-foreground">
              No scheme was given, so https:// is assumed.
            </p>
          )}
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {present.map((id) => (
              <li key={id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`size-2 rounded-sm ${PARTS[id].swatch}`} aria-hidden="true" />
                {PARTS[id].label}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-4">
          <CardTitle className="text-base">Breakdown</CardTitle>
          {parsed.canProbe && (
            <Button asChild size="sm" variant="outline">
              <Link to={`/metaprobe/extract?url=${encodeURIComponent(parsed.candidate)}`}>
                Extract metadata
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </CardHeader>

        <dl className="divide-y divide-border border-t border-border">
          <Row part="scheme" label="Scheme" value={parsed.scheme} note={parsed.schemeNote} />

          {parsed.opaque ? (
            <Row part="path" label="Path" value={parsed.pathname} />
          ) : (
            <>
              {(parsed.username || parsed.hasPassword) && (
                <>
                  <Row part="userinfo" label="Username" value={parsed.username} />
                  <Row
                    part="userinfo"
                    label="Password"
                    value={parsed.hasPassword ? "Present" : null}
                    copy={false}
                    note="Credentials in a URL are visible to anyone who sees it."
                  />
                </>
              )}

              <Row part="host" label="Host" value={parsed.hostname} note={parsed.hostLabel} />
              {domainParts && (
                <>
                  <Row part="host" label="Subdomain" value={domainParts.subdomain} />
                  <Row part="host" label="Domain" value={domainParts.domain} />
                  <Row
                    part="host"
                    label="Suffix (TLD)"
                    value={domainParts.suffix}
                    note="Estimated. Some suffixes, like co.uk, have several parts."
                  />
                </>
              )}

              <Row part="port" label="Port" value={parsed.port.value} note={parsed.port.note} />

              <Row
                part="path"
                label="Path"
                value={parsed.pathname}
                note={`${parsed.segments.length} segment${parsed.segments.length === 1 ? "" : "s"}`}
              />
              {parsed.segments.length > 0 && (
                <Row label="Path segments" copy={false} value="-">
                  <div className="flex flex-wrap gap-1.5">
                    {parsed.segments.map((segment, index) => (
                      <span
                        key={`${segment}-${index}`}
                        className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
                      >
                        {segment}
                      </span>
                    ))}
                  </div>
                </Row>
              )}
              {parsed.extension && (
                <Row part="path" label="File extension" value={`.${parsed.extension}`} />
              )}
            </>
          )}

          <Row
            part="query"
            label="Query"
            value={parsed.search || null}
            note={
              parsed.params.length > 0
                ? `${parsed.params.length} parameter${parsed.params.length === 1 ? "" : "s"}`
                : null
            }
          />
          <Row
            part="fragment"
            label="Fragment"
            value={parsed.fragment}
            note={parsed.fragment ? "Stays in the browser; it is never sent to the server." : null}
          />

          {parsed.origin && <Row label="Origin" value={parsed.origin} />}
          <Row label="Normalized URL" value={parsed.href} />
        </dl>
      </Card>

      {parsed.params.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Query parameters</CardTitle>
          </CardHeader>
          <dl className="divide-y divide-border border-t border-border">
            {parsed.params.map(([key, value], index) => (
              <div
                key={`${key}-${index}`}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="break-all font-mono text-sm text-violet-400">{key}</dt>
                <dd className="flex min-w-0 items-start justify-between gap-2">
                  {value ? (
                    <span className="break-all font-mono text-sm">{value}</span>
                  ) : (
                    <span className="text-sm italic text-muted-foreground">(empty)</span>
                  )}
                  {value && <CopyButton value={value} ariaLabel={`Copy value of ${key}`} />}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
    </div>
  );
}
