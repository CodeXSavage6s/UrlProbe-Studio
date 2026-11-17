import { Tags, ShieldCheck } from "lucide-react";

// Organisation-level links. Fill these in when they exist; anything left as
// null is simply not shown (footer) or marked "not linked yet" (cards).
export const RESOURCES = {
  githubOrg: null, // TODO: e.g. "https://github.com/your-org"
  docs: null, //      TODO: documentation site
};

// One entry per library. Every card, footer link and tool card reads from here.
//   status: "available" | "development"
//   github / pypi: a URL string, or null if it does not exist yet
//   pypiStatus: "coming-soon" shows a label instead of a link
export const LIBRARIES = [
  {
    id: "metaprobe",
    name: "MetaProbe",
    icon: Tags,
    status: "available",
    shortDescription: "Extract metadata from webpages.",
    description:
      "A Python library for extracting useful metadata from webpages, including titles, descriptions, Open Graph properties and Twitter Card information.",
    toolPath: "/metaprobe",
    probePath: "/metaprobe/extract",
    github: "https://github.com/CodeXSavage6s/metaprobe", // TODO: MetaProbe repository URL
    pypi: "https://pypi.org/project/metaprobe",
  },
  {
    id: "fetchfence",
    name: "FetchFence",
    icon: ShieldCheck,
    status: "development",
    shortDescription: "Validate URLs and assess URL safety.",
    description: "A Python library focused on URL validation and safety checks.",
    toolPath: "/fetchfence",
    github: null, // TODO: FetchFence repository URL, when it exists
    pypi: null,
    pypiStatus: "coming-soon",
  },
];
