// A small illustration of what "inspecting" a URL means: split it into parts.
const PARTS = [
  { text: "https://", label: "Scheme", tone: "text-primary", swatch: "bg-primary" },
  { text: "example.com", label: "Host", tone: "text-foreground", swatch: "bg-foreground" },
  { text: "/docs/page", label: "Path", tone: "text-muted-foreground", swatch: "bg-muted-foreground" },
  { text: "?ref=studio", label: "Query", tone: "text-warning", swatch: "bg-warning" },
];

export default function UrlAnatomy() {
  return (
    <figure className="rounded-lg border border-dashed border-border bg-card/40 p-5">
      <code className="block break-all font-mono text-sm leading-relaxed">
        {PARTS.map((part) => (
          <span key={part.label} className={part.tone}>{part.text}</span>
        ))}
      </code>
      <ul className="mt-4 space-y-1.5">
        {PARTS.map((part) => (
          <li key={part.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`size-2 rounded-sm ${part.swatch}`} aria-hidden="true" />
            <span className="w-14">{part.label}</span>
            <span className="font-mono">{part.text}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 text-xs text-muted-foreground">
        Anatomy of a URL. Studio's tools look at each part and at the page behind it.
      </figcaption>
    </figure>
  );
}
