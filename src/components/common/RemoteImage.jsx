import { useEffect, useState } from "react";

// An <img> that never shows a broken-image icon: if the file can't load, it
// shows `fallback` instead. Only http(s) sources are rendered.
export default function RemoteImage({ src, alt = "", className, fallback = null }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (failed || !/^https?:\/\//i.test(src ?? "")) return fallback;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
