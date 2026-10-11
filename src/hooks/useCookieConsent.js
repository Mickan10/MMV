import { useState, useEffect } from "react";

const KEY = "cookie-consent";
const EVENT = "cookie-consent-changed";

export function getCookieConsent() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setCookieConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // ignore (private mode etc.)
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

export function useCookieConsent() {
  const [consent, setConsent] = useState(getCookieConsent);

  useEffect(() => {
    const onChange = () => setConsent(getCookieConsent());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return [consent, setCookieConsent];
}
