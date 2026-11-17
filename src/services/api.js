// The low-level HTTP layer. Components never call fetch() themselves: they call
// functions in services/ (like metaprobe.js), which call request() below.

// Vite replaces import.meta.env.VITE_* with the value from your .env file.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

// One error type for every failure, so the UI can react to `kind`:
//   "network" -> the request never got a response (server down, CORS, offline)
//   "http"    -> the server answered with an error status
//   "invalid" -> the server answered, but not with something we can use
export class ApiError extends Error {
  constructor(message, { kind = "unknown", status } = {}) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

// FastAPI reports errors as { "detail": "text" } or { "detail": [{ "msg": ... }] }.
async function readErrorDetail(response) {
  try {
    const body = await response.json();
    if (typeof body?.detail === "string") return body.detail;
    if (Array.isArray(body?.detail)) {
      return body.detail.map((d) => d?.msg).filter(Boolean).join("; ") || null;
    }
  } catch {
    // The body was not JSON; fall back to the status line.
  }
  return null;
}

export async function request(path, { method = "GET", query, body, signal } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error; // cancelled on purpose
    throw new ApiError(`Could not reach the API at ${API_BASE_URL}.`, { kind: "network" });
  }

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new ApiError(
      detail ?? `The API responded with ${response.status} ${response.statusText}.`,
      { kind: "http", status: response.status }
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("The API returned a response that is not valid JSON.", {
      kind: "invalid",
    });
  }
}
