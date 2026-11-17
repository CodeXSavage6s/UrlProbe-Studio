import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import UrlForm from "@/components/common/UrlForm";
import EmptyState from "@/components/common/EmptyState";
import ErrorPanel from "@/components/common/ErrorPanel";
import MetadataResults from "@/components/tools/MetadataResults";
import ResultsSkeleton from "@/components/tools/ResultsSkeleton";
import { useMetaProbe } from "@/hooks/useMetaProbe";
import { useActivity } from "@/hooks/useActivity";
import { normalizeUrl } from "@/utils/url";
import { API_BASE_URL } from "@/services/api";
import { METAPROBE_ENDPOINT } from "@/config/endpoints";

// Turns an ApiError into a title plus a hint that says what to check.
function describeError(error) {
  const route = `GET ${METAPROBE_ENDPOINT.path}/{url}`;
  switch (error.kind) {
    case "network":
      return {
        title: "Can't reach the API",
        hint: `Check that the backend is running at ${API_BASE_URL} and that its CORS settings allow ${window.location.origin}.`,
      };
    case "http":
      if (error.status === 404 || error.status === 405) {
        return {
          title: "The API doesn't recognise this request",
          hint: `The route ${route} was not found. If the backend path changed, update src/config/endpoints.js.`,
        };
      }
      if (error.status === 422) {
        return {
          title: "The API rejected the request",
          hint: "The backend didn't accept this URL. Check the route in src/config/endpoints.js.",
        };
      }
      if (error.status >= 500) {
        return {
          title: "The API hit an error",
          hint: "The backend failed while processing this page. Its logs will show why.",
        };
      }
      return { title: "The API returned an error", hint: null };
    case "extract":
      return {
        title: "Couldn't extract metadata",
        hint: "The API answered, but reported that it couldn't read this page. Try another URL.",
      };
    case "invalid":
      return {
        title: "Unexpected response",
        hint: "The response wasn't in a shape this page can display. Update src/utils/metadata.js if the API format is different.",
      };
    default:
      return { title: "Something went wrong", hint: null };
  }
}

export default function MetaProbeExtract() {
  // The URL in the address bar (?url=...) is the single source of truth for
  // "what are we inspecting". Submitting the form changes it; an effect reacts.
  const [searchParams, setSearchParams] = useSearchParams();
  const paramUrl = searchParams.get("url") ?? "";

  const { status, url, raw, groups, error, run, reset } = useMetaProbe();
  const { add } = useActivity();

  const runAndRecord = useCallback(
    async (target) => {
      const outcome = await run(target);
      if (outcome !== undefined) add({ tool: "MetaProbe", url: target, ok: outcome });
    },
    [run, add]
  );

  useEffect(() => {
    const result = normalizeUrl(paramUrl);
    if (paramUrl && result.ok) runAndRecord(result.url);
    else reset();
  }, [paramUrl, runAndRecord, reset]);

  function handleSubmit(target) {
    if (target === paramUrl) runAndRecord(target); // same URL: run again
    else setSearchParams({ url: target });
  }

  const errorInfo = error ? describeError(error) : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Extract metadata"
        description="Submit a webpage URL and inspect the metadata MetaProbe finds: titles, descriptions, Open Graph properties and Twitter Cards."
      >
        <StatusBadge status="available" />
      </PageHeader>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <UrlForm
            initialValue={paramUrl}
            onSubmit={handleSubmit}
            loading={status === "loading"}
            buttonLabel="Extract"
            loadingLabel="Extracting…"
          />
        </CardContent>
      </Card>

      <div aria-live="polite">
        {status === "idle" && (
          <EmptyState
            icon={Tags}
            title="No page inspected yet"
            description="Enter a URL above. Results are grouped into basic metadata, Open Graph, Twitter Cards and anything else the API returns."
          />
        )}
        {status === "loading" && <ResultsSkeleton />}
        {status === "error" && (
          <ErrorPanel
            title={errorInfo.title}
            message={error.message}
            hint={errorInfo.hint}
            onRetry={() => runAndRecord(url)}
          />
        )}
        {status === "success" && <MetadataResults url={url} raw={raw} groups={groups} />}
      </div>
    </div>
  );
}
