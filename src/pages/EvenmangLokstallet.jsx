import "./EvenmangLokstallet.css";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const EvenemangLokstallet = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Håll koll på att Billetto-scriptet verkligen är laddat
  const [billettoReady, setBillettoReady] = useState(false);

  // ✅ Håll koll på vilka event-kort som är öppna
  const [openIds, setOpenIds] = useState(() => new Set());

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

      eventList.sort((a, b) => new Date(a.date) - new Date(b.date));
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const visibleEvents = events.filter(
    (event) => !event.hidden && event.date >= today
  );

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
              <article key={event.id} className={`event-card ${isOpen ? "open" : ""}`}>
                {event.image && (
                  <img src={event.image} alt={event.title} className="event-img" />
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

                  {/* ✅ Beskrivning som kan expandera */}
                  {event.description && (
                    <p className={`event-description ${isOpen ? "is-open" : ""}`}>
                      {event.description}
                    </p>
                  )}

                  {/* ✅ Mer information-knapp */}
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

                  {/* ✅ Billetto-knapp */}
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

                  {/* ✅ Fallback om billettoId saknas: visa din gamla knapp om link finns */}
                  {!billettoId && event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      <button className="bt-l2">Köp biljetter</button>
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
