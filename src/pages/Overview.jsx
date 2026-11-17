import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UrlBreakdown from "@/components/tools/UrlBreakdown";
import { parseUrl } from "@/utils/urlParts";

const EXAMPLES = [
  { label: "Full URL", value: "https://user@blog.example.co.uk:8443/docs/guide.html?ref=studio&lang=en#install" },
  { label: "Bare domain", value: "example.com" },
  { label: "IP and port", value: "http://192.168.1.10:3000/api/users?id=42" },
];

// The breakdown is computed from the input on every keystroke. Nothing is
// stored: `parsed` is derived state, so there is only one thing to keep in
// sync, the text in the box.
export default function Overview() {
  const [value, setValue] = useState("");
  const parsed = useMemo(() => parseUrl(value), [value]);

  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Your URL intelligence toolkit.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Paste a URL to see exactly what it is made of: scheme, host, port, path, query and fragment.
        </p>

        <div className="mt-8">
          <label htmlFor="overview-url" className="sr-only">URL to break down</label>
          <Input
            id="overview-url"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://example.com:8080/path?query=value#section"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={parsed.status === "invalid"}
            aria-describedby="overview-url-note"
            className="h-12 font-mono text-sm sm:text-base"
          />
          <p
            id="overview-url-note"
            className={
              parsed.status === "invalid"
                ? "mt-2 text-sm text-destructive"
                : "mt-2 text-xs text-muted-foreground"
            }
          >
            {parsed.status === "invalid"
              ? parsed.error
              : "Runs in your browser. Nothing is sent anywhere. A missing scheme is assumed to be https://."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {EXAMPLES.map((example) => (
              <Button
                key={example.label}
                variant="outline"
                size="sm"
                onClick={() => setValue(example.value)}
              >
                {example.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {parsed.status === "ok" && <UrlBreakdown parsed={parsed} />}
    </div>
  );
}
