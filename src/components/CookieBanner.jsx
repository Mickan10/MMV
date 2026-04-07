import { useState, useEffect } from "react";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function loadMetaPixel(pixelId) {
    if (window.fbq) return;
    const f = window; const b = document; const e = "script";
    const v = "https://connect.facebook.net/en_US/fbevents.js";
    let n, t, s;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
    loadMetaPixel("PIXEL_ID_HÄR"); // ← byt ut mot ditt riktiga Pixel-ID
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-backdrop">
      <div className="cookie-banner" role="dialog" aria-modal="true" aria-label="Cookie-inställningar">
        <div className="cookie-top">
          <p className="cookie-title">Vi använder cookies</p>
          <p className="cookie-text">
            Vi använder nödvändiga cookies för att sidan ska fungera, samt marknadsföringscookies (Meta Pixel) för att förstå hur besökare hittar oss.
          </p>

          <button
            className="cookie-details-toggle"
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
          >
            {showDetails ? "Dölj detaljer" : "Visa detaljer"}
          </button>

          {showDetails && (
            <div className="cookie-details">
              <div className="cookie-detail-item">
                <span className="cookie-detail-name">Nödvändiga</span>
                <span className="cookie-detail-desc">Firebase — krävs för att sidan ska fungera. Kan inte stängas av.</span>
                <span className="cookie-always-on">Alltid aktiv</span>
              </div>
              <div className="cookie-detail-item">
                <span className="cookie-detail-name">Marknadsföring</span>
                <span className="cookie-detail-desc">Meta Pixel (Facebook) — hjälper oss förstå hur besökare hittar oss via sociala medier.</span>
              </div>
              <div className="cookie-detail-item">
                <span className="cookie-detail-name">Tredjepartswidgetar</span>
                <span className="cookie-detail-desc">Billetto — biljettwidget som kan sätta egna cookies.</span>
              </div>
            </div>
          )}
        </div>

        <div className="cookie-actions">
          <button className="cookie-btn cookie-btn--decline" onClick={decline}>
            Endast nödvändiga
          </button>
          <button className="cookie-btn cookie-btn--accept" onClick={accept}>
            Acceptera alla
          </button>
        </div>
      </div>
    </div>
  );
}
