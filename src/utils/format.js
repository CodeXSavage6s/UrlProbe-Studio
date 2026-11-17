const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

// 1731700000000 -> "5 minutes ago"
export function formatRelativeTime(timestamp, now = Date.now()) {
  const seconds = Math.round((timestamp - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  return rtf.format(Math.round(seconds / 86400), "day");
}
