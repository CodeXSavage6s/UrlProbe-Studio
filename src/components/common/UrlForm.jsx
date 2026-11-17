import { useEffect, useId, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { normalizeUrl } from "@/utils/url";
import { cn } from "@/lib/utils";

// A URL input with validation. It never talks to the backend: it validates,
// normalizes, then hands the clean URL to `onSubmit`. That is why the same
// form works on the Overview page and on the MetaProbe page.
export default function UrlForm({
  initialValue = "",
  onSubmit,
  loading = false,
  buttonLabel = "Probe",
  loadingLabel = "Probing…",
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);
  const inputId = useId();

  // When the page hands us a new URL (e.g. from the address bar), show it.
  useEffect(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  function handleSubmit(event) {
    event.preventDefault();
    const result = normalizeUrl(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    if (result.addedScheme) setValue(result.url); // show what will actually be sent
    onSubmit(result.url);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className="sr-only">URL to inspect</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={inputId}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          placeholder="example.com or https://example.com"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={`${inputId}-note`}
          className={cn(
            "h-11 font-mono text-sm",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <Button type="submit" disabled={loading} className="h-11 sm:px-6">
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              {loadingLabel}
            </>
          ) : (
            buttonLabel
          )}
        </Button>
      </div>
      {error ? (
        <p id={`${inputId}-note`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p id={`${inputId}-note`} className="mt-2 text-xs text-muted-foreground">
          If you leave out the scheme, https:// is added. An explicit http:// or https:// is kept as typed.
        </p>
      )}
    </form>
  );
}
