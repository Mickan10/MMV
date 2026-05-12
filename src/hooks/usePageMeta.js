import { useEffect } from "react";

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} – Lokstallet Skövde` : "Lokstallet Skövde – Musik, Evenemang & Möten";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || "Lokstallet i Skövde – en unik kulturlokal för konserter, teater, föreläsningar och privata evenemang.";

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title ? `${title} – Lokstallet Skövde` : "Lokstallet Skövde";

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description || "Lokstallet i Skövde – en unik kulturlokal för konserter, teater, föreläsningar och privata evenemang.";
  }, [title, description]);
}
