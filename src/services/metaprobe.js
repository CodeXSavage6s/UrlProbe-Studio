import { ApiError, request } from "@/services/api";
import { METAPROBE_ENDPOINT } from "@/config/endpoints";

// Asks the backend to extract metadata for one URL. Returns the parsed JSON
// exactly as the API sent it ({ success, metadata }); shaping it for display
// happens in utils/metadata.js.
export async function probeUrl(url, { signal } = {}) {
  const { path, method } = METAPROBE_ENDPOINT;

  // The target URL travels inside the path, so it must be URL-encoded.
  const raw = await request(`${path}/${encodeURIComponent(url)}`, { method, signal });

  // A 200 response with success:false is still a failure; surface it as one.
  if (raw && raw.success === false) {
    const reason = [raw.error, raw.message, raw.detail].find(
      (value) => typeof value === "string" && value.trim()
    );
    throw new ApiError(reason ?? "MetaProbe could not extract metadata for this URL.", {
      kind: "extract",
    });
  }

  return raw;
}
