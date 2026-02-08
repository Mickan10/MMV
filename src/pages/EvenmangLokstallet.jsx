import "./EvenmangLokstallet.css";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const EvenemangLokstallet = () => {
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [billettoReady, setBillettoReady] = useState(false);
  const [openIds, setOpenIds] = useState(() => new Set());

  const toggleOpen = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Ladda Billetto-scriptet
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
    script.onerror = () =>
      console.warn("Kunde inte ladda Billetto-widget (widget.js).");

    document.body.appendChild(script);
  }, []);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));

      const eventList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        };
      });

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
        const da = a.date instanceof Date ? a.date : new Date(a.date);
        const dbb = b.date instanceof Date ? b.date : new Date(b.date);

        da.setHours(0, 0, 0, 0);
        dbb.setHours(0, 0, 0, 0);

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
    return events.filter((event) => !event.hidden && event.date >= today);
  }, [events, today]);

  // ✅ Scrolla till rätt event när vi kommer från startsidan
  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (!targetId) return;

    // Kör först när listan som faktiskt renderas finns
    if (visibleEvents.length === 0) return;

    let tries = 0;
    const maxTries = 120; // mer tåligt om bilder/widgets tar tid

    const scrollToTarget = () => {
      const el = document.getElementById(targetId);

      if (el) {
        const headerOffset = window.innerWidth <= 400 ? 64 : 70;
        const y =
          el.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;

        window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }

      tries += 1;
      if (tries < maxTries) {
        requestAnimationFrame(scrollToTarget);
      }
    };

    requestAnimationFrame(scrollToTarget);
  }, [location.key, visibleEvents.length]);

  if (loading) return <p>Laddar evenemang...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section id="events" className="evenemang-lokstallet">
      <div className="evenemang-container">
        <h2 className="evenemang-title">Vad händer på Lokstallet?</h2>
        <p className="evenemang-intro">
          Här hittar du aktuella evenemang och föreställningar.
        </p>

        <div className="event-grid">
          {visibleEvents.length === 0 && <p>Inga aktuella evenemang att visa.</p>}

          {visibleEvents.map((event) => {
            const billettoId = event.billettoEventId ?? event.billettoId ?? null;
            const isOpen = openIds.has(event.id);

            return (
              <article
                id={`event-${event.id}`}
                key={event.id}
                className={`event-card ${isOpen ? "open" : ""}`}
              >
                {event.image && (
                  <div className="event-image-wrap">
                    <img src={event.image} alt={event.title} />
                  </div>
                )}

                <div className="event-content">
                  <h3 className="event-heading">{event.title}</h3>

                  <p className="event-date">
                    <span className="event-date-item">
                      Datum: {event.date.toLocaleDateString()}
                    </span>

                    {event.time && (
                      <span className="event-date-item">Tid: {event.time}</span>
                    )}

                    {event.location && (
                      <span className="event-date-item">
                        Plats: {event.location}
                      </span>
                    )}
                  </p>

                  {event.description && (
                    <p className={`event-description ${isOpen ? "is-open" : ""}`}>
                      {event.description}
                    </p>
                  )}

                  {event.description && event.description.length > 160 && (
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
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      <button className="bt-l2">Skaffa biljetter</button>
                    </a>
                  )}
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
