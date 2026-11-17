// Turns whatever the user typed into a full URL the backend accepts.
//   "example.com"          -> https://example.com   (scheme added)
//   "http://example.com"   -> http://example.com    (kept exactly as typed)
//   "ftp://example.com"    -> error                 (only http/https supported)
export function normalizeUrl(input) {
  const value = (input ?? "").trim();

  if (!value) return { ok: false, error: "Enter a URL to continue." };
  if (/\s/.test(value)) return { ok: false, error: "A URL cannot contain spaces." };

  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value);
  // "mailto:x", "javascript:x" and "ftp://x" are rejected. "localhost:3000" is
  // fine, because a port number follows the colon.
  const otherScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:(?!\d)/.test(value);
  if ((hasScheme && !/^https?:\/\//i.test(value)) || (!hasScheme && otherScheme)) {
    return { ok: false, error: "Only http:// and https:// URLs are supported." };
  }

  const candidate = hasScheme ? value : `https://${value}`;

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      ok: false,
      error: "That doesn't look like a valid URL. Try something like example.com.",
    };
  }

  const host = parsed.hostname;
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith("[");
  if (host !== "localhost" && !isIp && !host.includes(".")) {
    return {
      ok: false,
      error: `"${host}" is missing a domain ending, such as .com or .org.`,
    };
  }

  return { ok: true, url: candidate, addedScheme: !hasScheme };
}
