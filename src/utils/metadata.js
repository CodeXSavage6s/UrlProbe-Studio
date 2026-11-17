import { ApiError } from "@/services/api";

// Turns the API's JSON into the four display groups: basic, Open Graph,
// Twitter Cards and other. It does not assume a fixed response shape: it
// accepts flat keys ("og:title"), nested groups ({ og: { title } }) and a
// wrapper object ({ metadata: { ... } }). Anything it cannot place goes to
// "Other", so no returned field is ever dropped.
//
// The real API returns { success, metadata: { title, description, viewport,
// open_graph: { "og:title": ... }, twitter_card: { "twitter:card": ... } } }.

const WRAPPER_KEYS = ["metadata", "data", "result"];
const OG_CONTAINER = /^(og|open_?graph)$/i;
const TWITTER_CONTAINER = /^twitter(_?cards?)?$/i;
const BASIC_CONTAINER = /^(basic|general|meta|html)$/i;

const BASIC_NAMES = new Set([
  "title", "description", "canonical", "canonicalurl", "url", "favicon", "icon",
  "language", "lang", "charset", "keywords", "author", "robots", "viewport",
  "themecolor", "generator", "sitename", "locale",
]);

// Fields we always show, even when missing, so gaps are visible.
const EXPECTED = {
  basic: [
    { key: "title", label: "Title", aliases: ["title", "pagetitle"] },
    { key: "description", label: "Description", aliases: ["description", "metadescription"] },
    { key: "canonical", label: "Canonical URL", aliases: ["canonical", "canonicalurl", "canonicallink"] },
  ],
  openGraph: ["title", "description", "image", "url"].map((n) => ({
    key: `og:${n}`, label: `og:${n}`, aliases: [`og${n}`],
  })),
  twitter: ["card", "title", "description", "image"].map((n) => ({
    key: `twitter:${n}`, label: `twitter:${n}`, aliases: [`twitter${n}`],
  })),
};

const GROUP_META = {
  basic: { title: "Basic metadata", description: "Core fields a page declares about itself." },
  openGraph: { title: "Open Graph", description: "Properties used to build link previews on social platforms and in chat apps." },
  twitter: { title: "Twitter Cards", description: "Properties used by Twitter to render shared links." },
  other: { title: "Other metadata", description: "Everything else the API returned." },
};
const GROUP_ORDER = ["basic", "openGraph", "twitter", "other"];

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const normKey = (key) => String(key).toLowerCase().replace(/[^a-z0-9]/g, "");

function classify(key) {
  const lower = String(key).toLowerCase();
  if (/^(og|opengraph|open_graph)[:_.-]/.test(lower)) return "openGraph";
  if (/^twitter[:_.-]/.test(lower)) return "twitter";
  if (BASIC_NAMES.has(normKey(key))) return "basic";
  return "other";
}

export function toDisplay(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value) && value.every((v) => ["string", "number", "boolean"].includes(typeof v))) {
    return value.join(", ");
  }
  return JSON.stringify(value, null, 2);
}

function addPrefixed(obj, prefix, out) {
  for (const [key, value] of Object.entries(obj)) {
    const lower = key.toLowerCase();
    const already = [":", "_", "."].some((sep) => lower.startsWith(prefix + sep));
    out.push([already ? key : `${prefix}:${key}`, value]);
  }
}

function collect(obj, out) {
  for (const [key, value] of Object.entries(obj)) {
    if (isPlainObject(value)) {
      if (OG_CONTAINER.test(key)) { addPrefixed(value, "og", out); continue; }
      if (TWITTER_CONTAINER.test(key)) { addPrefixed(value, "twitter", out); continue; }
      if (BASIC_CONTAINER.test(key)) { collect(value, out); continue; }
    }
    out.push([key, value]);
  }
}

export function groupMetadata(raw) {
  if (!isPlainObject(raw)) {
    throw new ApiError("The API returned data in an unexpected format: expected a JSON object.", {
      kind: "invalid",
    });
  }

  let main = raw;
  let siblings = [];
  for (const wrapper of WRAPPER_KEYS) {
    if (isPlainObject(raw[wrapper])) {
      main = raw[wrapper];
      siblings = Object.entries(raw).filter(
        ([key, v]) =>
          key !== wrapper && key !== "success" && !isPlainObject(v) && !Array.isArray(v)
      );
      break;
    }
  }

  const entries = [];
  collect(main, entries);
  for (const sibling of siblings) {
    if (!entries.some(([key]) => key === sibling[0])) entries.push(sibling);
  }

  const used = new Set();
  const groups = { basic: [], openGraph: [], twitter: [], other: [] };

  for (const id of ["basic", "openGraph", "twitter"]) {
    for (const spec of EXPECTED[id]) {
      const index = entries.findIndex(
        ([key], i) => !used.has(i) && spec.aliases.includes(normKey(key))
      );
      let value = "";
      if (index >= 0) {
        used.add(index);
        value = toDisplay(entries[index][1]);
      }
      groups[id].push({ key: spec.key, label: spec.label, value, found: value !== "", expected: true });
    }
  }

  entries.forEach(([key, raw], i) => {
    if (used.has(i)) return;
    const value = toDisplay(raw);
    groups[classify(key)].push({ key, label: key, value, found: value !== "", expected: false });
  });

  return GROUP_ORDER.map((id) => ({ id, ...GROUP_META[id], rows: groups[id] })).filter(
    (group) => group.id !== "other" || group.rows.length > 0
  );
}

export function hasAnyMetadata(groups) {
  return groups.some((group) => group.rows.some((row) => row.found));
}

// Picks the best title / description / image for the link-preview card.
export function getSocialPreview(groups) {
  const find = (id, key) =>
    groups.find((g) => g.id === id)?.rows.find((r) => r.key === key && r.found)?.value;

  const preview = {
    title: find("openGraph", "og:title") ?? find("twitter", "twitter:title") ?? find("basic", "title"),
    description:
      find("openGraph", "og:description") ?? find("twitter", "twitter:description") ?? find("basic", "description"),
    image: find("openGraph", "og:image") ?? find("twitter", "twitter:image"),
    url: find("openGraph", "og:url") ?? find("basic", "canonical"),
  };
  return preview.title || preview.description || preview.image ? preview : null;
}

