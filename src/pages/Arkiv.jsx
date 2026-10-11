import { useState, useEffect, useMemo } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { usePageMeta } from "../hooks/usePageMeta";
import "./Arkiv.css";

const MONTH_SHORT = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  return `${parseInt(d, 10)} ${MONTH_SHORT[parseInt(m, 10) - 1]} ${y}`;
}

export default function Arkiv() {
  usePageMeta("Arkiv", "Bilder från tidigare kvällar på Lokstallet i Skövde.");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const snapshot = await getDocs(collection(db, "arkivbilder"));
        const imgs = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""));
        setImages(imgs);
      } catch (err) {
        console.error("Fetch arkivbilder error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // Månader som finns bland bilderna, som "YYYY-MM"-strängar
  const months = useMemo(() => {
    const seen = new Set();
    images.forEach((img) => {
      if (img.date) seen.add(img.date.slice(0, 7));
    });
    return Array.from(seen).sort().reverse();
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedMonth === null) return images;
    return images.filter((img) => img.date && img.date.slice(0, 7) === selectedMonth);
  }, [images, selectedMonth]);

  // Gruppera bilderna per datum, i den ordning de redan är sorterade
  const groups = useMemo(() => {
    const map = new Map();
    filteredImages.forEach((img) => {
      const key = img.date || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(img);
    });
    return Array.from(map.entries());
  }, [filteredImages]);

  return (
    <main className="arkivbilder-main">
      <div className="arkivbilder-container">
        <h1>Arkiv</h1>
        <p className="arkivbilder-intro">Bilder från tidigare kvällar på Lokstallet.</p>

        {months.length > 1 && (
          <div className="month-filter-wrap">
            <label htmlFor="arkiv-month-filter" className="sr-only">Filtrera på månad</label>
            <select
              id="arkiv-month-filter"
              className="month-filter-select"
              value={selectedMonth ?? ""}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
            >
              <option value="">Sortera på månad</option>
              {months.map((m) => {
                const [year, month] = m.split("-");
                const label = new Date(Number(year), Number(month) - 1, 1)
                  .toLocaleDateString("sv-SE", { month: "long", year: "numeric" });
                return (
                  <option key={m} value={m}>
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {loading && <p className="arkivbilder-loading">Laddar…</p>}

        {!loading && filteredImages.length === 0 && (
          <p className="arkivbilder-empty">Inga bilder tillagda ännu.</p>
        )}

        {groups.map(([dateKey, imgs]) => {
          const artist = imgs.find((img) => img.artist)?.artist;
          return (
          <div key={dateKey || "no-date"} className="arkivbilder-group">
            <div className="arkivbilder-date-header">
              {artist && <span className="arkivbilder-artist">{artist}</span>}
              <span>{dateKey ? formatShortDate(dateKey) : "Odaterat"}</span>
              <span className="arkivbilder-date-line" />
            </div>
            <div className="arkivbilder-grid">
              {imgs.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  className="arkivbilder-item"
                  onClick={() => setLightbox(img.image)}
                  aria-label="Visa bild i helskärm"
                >
                  <img src={img.image} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
          );
        })}
      </div>

      {lightbox && (
        <div className="arkivbilder-lightbox" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="arkivbilder-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Stäng"
          >
            ×
          </button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
