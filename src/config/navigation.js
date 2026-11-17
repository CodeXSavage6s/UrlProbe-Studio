import { LayoutDashboard, Tags, ShieldCheck, Network } from "lucide-react";

// The sidebar is generated from this list. To add a library, add an item.
// To add a function to a library, add an entry to its `children`.
export const navigation = [
  {
    label: "Platform",
    items: [{ title: "Overview", url: "/", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Libraries",
    items: [
      {
        title: "MetaProbe",
        url: "/metaprobe",
        icon: Tags,
        children: [{ title: "Extract metadata", url: "/metaprobe/extract" }],
      },
      { title: "FetchFence", url: "/fetchfence", icon: ShieldCheck, badge: "Soon" },
    ],
  },
  {
    label: "Project",
    items: [{ title: "Ecosystem", url: "/ecosystem", icon: Network }],
  },
];

export function isActivePath(pathname, url, exact = false) {
  if (exact) return pathname === url;
  return pathname === url || pathname.startsWith(`${url}/`);
}

// Used by the header breadcrumbs: ["MetaProbe", "Extract metadata"]
export function getBreadcrumbs(pathname) {
  for (const group of navigation) {
    for (const item of group.items) {
      if (!isActivePath(pathname, item.url, item.exact)) continue;
      const child = item.children?.find((c) => isActivePath(pathname, c.url));
      return child ? [item.title, child.title] : [item.title];
    }
  }
  return [];
}
