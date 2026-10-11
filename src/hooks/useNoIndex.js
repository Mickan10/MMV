import { useEffect } from "react";

// Håller sökmotorer borta från admin-sidorna. Kompletteras av en X-Robots-Tag-header
// i .htaccess för robusthet mot crawlers som inte kör JS.
export function useNoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = "noindex, nofollow";
    return () => {
      meta.content = prev || "index, follow";
    };
  }, []);
}
