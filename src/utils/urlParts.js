// Splits a URL into its parts for display. Runs entirely in the browser using
// the standard URL class: nothing is sent to the backend.

const DEFAULT_PORTS = { "http:": 80, "https:": 443, "ftp:": 21, "ws:": 80, "wss:": 443 };
const SECURE = new Set(["https:", "wss:"]);
const PLAIN = new Set(["http:", "ws:", "ftp:"]);

// Common suffixes that have two parts. A full answer needs the Public Suffix
// List, so domain/suffix splitting is an estimate and the UI says so.
const TWO_PART_SUFFIXES = new Set([
  "co.uk", "org.uk", "ac.uk", "gov.uk", "me.uk", "com.au", "net.au", "org.au",
  "edu.au", "co.nz", "co.jp", "co.kr", "co.in", "co.za", "co.il", "com.br",
  "com.mx", "com.ar", "com.cn", "com.tw", "com.hk", "com.sg", "com.tr",
  "com.ng", "com.gh",
]);

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

function classifyHost(hostname) {
  if (hostname.startsWith("[")) return { kind: "ipv6", label: "IPv6 address" };

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    const [a, b] = hostname.split(".").map(Number);
    if (a === 127) return { kind: "ipv4", label: "IPv4 address (loopback: this machine)" };
    if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) {
      return { kind: "ipv4", label: "IPv4 address (private network)" };
    }
    return { kind: "ipv4", label: "IPv4 address" };
  }

  if (hostname === "localhost") return { kind: "localhost", label: "Loopback name (this machine)" };
  if (!hostname.includes(".")) return { kind: "single", label: "Single-label host (no domain suffix)" };
  return { kind: "domain", label: "Domain name" };
}

function splitDomain(hostname) {
  const labels = hostname.split(".");
  const lastTwo = labels.slice(-2).join(".").toLowerCase();
  const suffixLength = TWO_PART_SUFFIXES.has(lastTwo) ? 2 : 1;
  if (labels.length <= suffixLength) return null;

  return {
    subdomain: labels.slice(0, -(suffixLength + 1)).join(".") || null,
    domain: labels.slice(-(suffixLength + 1)).join("."),
    suffix: labels.slice(-suffixLength).join("."),
  };
}

function describePort(url) {
  const fallback = DEFAULT_PORTS[url.protocol];
  if (url.port) return { value: url.port, note: "Written explicitly in the URL" };
  if (fallback) {
    return {
      value: String(fallback),
      note: `Default for ${url.protocol.slice(0, -1)}`,
    };
  }
  return { value: null, note: null };
}

// Returns { status: "empty" | "invalid" | "ok", ... }.
export function parseUrl(input) {
  const raw = (input ?? "").trim();
  if (!raw) return { status: "empty" };
  if (/\s/.test(raw)) {
    return { status: "invalid", error: "A URL can't contain spaces. They are written as %20." };
  }

  // "localhost:3000" and "example.com:8080" have a colon but no scheme.
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:(?!\d)/.test(raw);
  const candidate = hasScheme ? raw : `https://${raw}`;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return { status: "invalid", error: "That doesn't look like a valid URL yet." };
  }

  const opaque = !url.host && !/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate);
  const host = classifyHost(url.hostname);
  const segments = url.pathname.split("/").filter(Boolean).map(safeDecode);
  const extension = opaque ? null : segments.at(-1)?.match(/\.([A-Za-z0-9]{1,8})$/)?.[1] ?? null;
  const hasUserinfo = Boolean(url.username || url.password);

  // The URL written out in pieces, in order, for the colored line at the top.
  const pieces = [{ id: "scheme", text: opaque ? url.protocol : `${url.protocol}//` }];
  if (opaque) {
    pieces.push({ id: "path", text: url.pathname });
  } else {
    if (hasUserinfo) {
      pieces.push({ id: "userinfo", text: `${url.username}${url.password ? `:${url.password}` : ""}@` });
    }
    pieces.push({ id: "host", text: url.hostname });
    if (url.port) pieces.push({ id: "port", text: `:${url.port}` });
    if (url.pathname) pieces.push({ id: "path", text: url.pathname });
  }
  if (url.search) pieces.push({ id: "query", text: url.search });
  if (url.hash) pieces.push({ id: "fragment", text: url.hash });

  return {
    status: "ok",
    candidate,
    href: url.href,
    schemeAssumed: !hasScheme,
    opaque,
    pieces,
    scheme: url.protocol.slice(0, -1),
    schemeNote: SECURE.has(url.protocol)
      ? "Encrypted connection (TLS)"
      : PLAIN.has(url.protocol)
        ? "Not encrypted"
        : null,
    username: url.username ? safeDecode(url.username) : null,
    hasPassword: Boolean(url.password),
    hostname: url.hostname,
    hostKind: host.kind,
    hostLabel: host.label,
    domainParts: host.kind === "domain" ? splitDomain(url.hostname) : null,
    port: describePort(url),
    pathname: url.pathname,
    segments,
    extension,
    search: url.search,
    params: [...url.searchParams.entries()],
    fragment: url.hash ? safeDecode(url.hash.slice(1)) : null,
    origin: url.origin !== "null" ? url.origin : null,
    canProbe: ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname),
  };
}
