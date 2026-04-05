import "./EvenmangLokstallet.css";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocsFromServer } from "firebase/firestore";

const EvenemangLokstallet = () => {
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [billettoReady, setBillettoReady] = useState(false);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [selectedGenre, setSelectedGenre] = useState("Alla");

  const toggleOpen = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const src = "https://billetto.se/widget.js";
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      if (window.customElements?.get?.("billetto-widget")) {
        setBillettoReady(true);
      } else {
        setTimeout(() => setBillettoReady(true), 300);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => setBillettoReady(true);
    script.onerror = () => console.warn("Kunde inte ladda Billetto-widget (widget.js).");
    document.body.appendChild(script);
  }, []);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocsFromServer(collection(db, "events"));

      // Parsa datum som lokal tid (inte UTC) för att undvika att svenska evenemang
      // hamnar en dag bakåt pga tidszonsförskjutning
      const parseLocalDate = (val) => {
        if (!val) return null;
        if (val?.toDate) return val.toDate(); // Firestore Timestamp
        const str = String(val).trim();
        // "YYYY-MM-DD" → parsa som lokal tid
        const isoDate = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoDate) {
          return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
        }
        return new Date(str);
      };

      const eventList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const parsed = parseLocalDate(data.date);
        return {
          id: doc.id,
          ...data,
          date: parsed instanceof Date && !isNaN(parsed) ? parsed : null,
        };
      }).filter((e) => e.date !== null); // kasta bort event utan giltigt datum

      const toMinutes = (t) => {
        if (!t) return 9999;
        const s = String(t).trim().replace(".", ":");
        const [hh, mm] = s.split(":");
        const h = Number(hh);
        const m = Number(mm ?? 0);
        if (Number.isNaN(h) || Number.isNaN(m)) return 9999;
        return h * 60 + m;
      };

      eventList.sort((a, b) => {
        const da = new Date(a.date); da.setHours(0, 0, 0, 0);
        const dbb = new Date(b.date); dbb.setHours(0, 0, 0, 0);
        const diff = da - dbb;
        if (diff !== 0) return diff;
        return toMinutes(a.time) - toMinutes(b.time);
      });

      setEvents(eventList);
      setLoading(false);
    } catch (err) {
      console.error("Fel vid hämtning av events:", err);
      setError("Kunde inte hämta evenemang. Försök igen senare.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      if (event.hidden === true) return false;
      const d = new Date(event.date);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    });
  }, [events, today]);

  const genres = useMemo(() => {
    const set = new Set();
    visibleEvents.forEach((e) => { if (e.genre) set.add(e.genre); });
    return ["Alla", ...Array.from(set).sort()];
  }, [visibleEvents]);

  const filteredEvents = useMemo(() => {
    if (selectedGenre === "Alla") return visibleEvents;
    return visibleEvents.filter((e) => e.genre === selectedGenre);
  }, [visibleEvents, selectedGenre]);

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (!targetId) return;
    if (visibleEvents.length === 0) return;

    let tries = 0;
    const maxTries = 120;

    const scrollToTarget = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = window.innerWidth <= 400 ? 64 : 70;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;
        window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }
      tries += 1;
      if (tries < maxTries) requestAnimationFrame(scrollToTarget);
    };

    requestAnimationFrame(scrollToTarget);
  }, [location.key, visibleEvents.length]);

  if (loading) return <p role="status" aria-live="polite">Laddar evenemang...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <section id="events" className="evenemang-lokstallet">
      <div className="evenemang-container">
        <h2 className="evenemang-title">Vad händer på Lokstallet?</h2>
        <p className="evenemang-intro">Här hittar du aktuella evenemang och föreställningar.</p>

        {genres.length > 1 && (
          <div className="genre-filter-bar">
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                className={`genre-filter-btn ${selectedGenre === g ? "active" : ""}`}
                onClick={() => setSelectedGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        <div className="event-grid">
          {filteredEvents.length === 0 && (
            <p className="no-events-msg">Inga evenemang inom vald genre.</p>
          )}

          {filteredEvents.map((event) => {
            const billettoId = (() => {
              if (event.billettoEventId) return String(event.billettoEventId);
              if (event.billettoId) return String(event.billettoId);
              // Extrahera numeriskt ID ur Billetto-URL, t.ex. billetto.se/e/namn-pa-event-1872281
              const match = event.link?.match(/billetto\.se(?:\/[a-z]{2})?\/e\/[^/?#]*?-?(\d+)(?:[/?#]|$)/i);
              return match ? match[1] : null;
            })();
            const isOpen = openIds.has(event.id);

            return (
              <article
                id={`event-${event.id}`}
                key={event.id}
                className={`event-card ${isOpen ? "open" : ""}`}
              >
                {/* BILD med genre-tagg överst */}
                <div className="event-image-wrap">
                  {event.image
                    ? <img src={event.image} alt={event.title} />
                    : <div className="event-image-placeholder" />
                  }
                  {event.genre && (
                    <span className="event-genre-tag">{event.genre}</span>
                  )}
                </div>

                {/* INFO UNDER BILDEN */}
                <div className="event-content">
                  <h3 className="event-heading">{event.title}</h3>

                  {event.subtitle && (
                    <p className="event-subtitle">{event.subtitle}</p>
                  )}

                  <div className="event-meta-row">
                    <span className="event-meta-item event-meta-date">
                      {event.date.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                    {event.time && (
                      <span className="event-meta-item">{event.time}</span>
                    )}
                    {event.location && (
                      <span className="event-meta-item">{event.location}</span>
                    )}
                    {event.price && (
                      <span className="event-meta-item event-price">{event.price}</span>
                    )}
                  </div>

                  {event.description && (
                    <div className={`event-description ${isOpen ? "is-open" : ""}`}>
                      <p>{event.description}</p>
                      {isOpen && event.description2 && <p>{event.description2}</p>}
                      {isOpen && event.description3 && <p>{event.description3}</p>}
                    </div>
                  )}

                  <div className="event-actions">
                    {[event.description, event.description2, event.description3].join("").length > 120 && (
                      <button
                        type="button"
                        className="more-info-btn"
                        onClick={() => toggleOpen(event.id)}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "Visa mindre" : "Mer information"}
                      </button>
                    )}

                    {billettoId && billettoReady && (
                      <div className="billetto-widget-wrap">
                        <billetto-widget
                          type="button"
                          event={String(billettoId)}
                          organization="billetto.se"
                          lang="sv"
                          theme="dark"
                          color="#bfa567"
                          button-style="rounded"
                          font-family="Roboto"
                          whitelabel
                        />
                      </div>
                    )}

                    {!billettoId && event.link && (
                      <a href={event.link} target="_blank" rel="noopener noreferrer" aria-label={`Skaffa biljetter till ${event.title} (öppnas i nytt fönster)`}>
                        <button className="bt-l2">Skaffa biljetter</button>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EvenemangLokstallet;
