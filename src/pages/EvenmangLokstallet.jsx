import "./EvenmangLokstallet.css";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const EvenemangLokstallet = () => {
  usePageMeta("Evenemang & Biljetter", "Kommande konserter, teater och evenemang på Lokstallet i Skövde. Köp biljetter direkt här.");
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billettoReady, setBillettoReady] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [modalEvent, setModalEvent] = useState(null);
  const navigate = useNavigate();
  const modalCloseRef = useRef(null);
  const triggerRef = useRef(null);

  const openModal = useCallback((event, triggerEl) => {
    triggerRef.current = triggerEl ?? null;
    setModalEvent(event);
    navigate(`?event=${event.id}`, { replace: true });
  }, [navigate]);

  const closeModal = useCallback(() => {
    setModalEvent(null);
    navigate("", { replace: true });
    triggerRef.current?.focus();
  }, [navigate]);

  // Öppna modal automatiskt om ?event=ID finns i URL
  useEffect(() => {
    if (events.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("event");
    if (eventId) {
      const found = events.find((e) => e.id === eventId);
      if (found) setModalEvent(found);
    }
  }, [events]);

  // Fokus + fokusfälla + Escape när modal öppnas
  useEffect(() => {
    if (!modalEvent) return;

    // Flytta fokus till stäng-knappen
    const frame = requestAnimationFrame(() => modalCloseRef.current?.focus());

    const onKey = (e) => {
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;

      const modal = modalCloseRef.current?.closest(".event-modal");
      if (!modal) return;
      const focusable = Array.from(
        modal.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.closest("iframe"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalEvent, closeModal]);

  useEffect(() => {
    const src = "https://billetto.se/widget.js";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.customElements?.get?.("billetto-widget")) setBillettoReady(true);
      else setTimeout(() => setBillettoReady(true), 300);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => setBillettoReady(true);
    script.onerror = () => console.warn("Kunde inte ladda Billetto-widget.");
    document.body.appendChild(script);
  }, []);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));

      const parseLocalDate = (val) => {
        if (!val) return null;
        if (val?.toDate) return val.toDate();
        const str = String(val).trim();
        const isoDate = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoDate) return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
        return new Date(str);
      };

      const eventList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const parsed = parseLocalDate(data.date);
        return { id: doc.id, ...data, date: parsed instanceof Date && !isNaN(parsed) ? parsed : null };
      }).filter((e) => e.date !== null);

      const toMinutes = (t) => {
        if (!t) return 9999;
        const s = String(t).trim().replace(".", ":");
        const [hh, mm] = s.split(":");
        const h = Number(hh), m = Number(mm ?? 0);
        if (Number.isNaN(h) || Number.isNaN(m)) return 9999;
        return h * 60 + m;
      };

      eventList.sort((a, b) => {
        const da = new Date(a.date); da.setHours(0, 0, 0, 0);
        const dbb = new Date(b.date); dbb.setHours(0, 0, 0, 0);
        const diff = da - dbb;
        return diff !== 0 ? diff : toMinutes(a.time) - toMinutes(b.time);
      });

      setEvents(eventList);
      setLoading(false);
    } catch (err) {
      console.error("Fel vid hämtning av events:", err);
      setError("Kunde inte hämta evenemang. Försök igen senare.");
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const today = useMemo(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0); return t;
  }, []);

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      if (event.hidden === true) return false;
      const d = new Date(event.date); d.setHours(0, 0, 0, 0);
      return d >= today;
    });
  }, [events, today]);

  const getGenres = (genre) => {
    if (!genre) return [];
    if (Array.isArray(genre)) return genre;
    return [genre];
  };

  const genres = useMemo(() => {
    const set = new Set();
    visibleEvents.forEach((e) => getGenres(e.genre).forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [visibleEvents]);

  const toggleGenre = useCallback((g) => {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }, []);

  // Månader som finns bland kommande events, som "YYYY-MM"-strängar
  const months = useMemo(() => {
    const seen = new Set();
    visibleEvents.forEach((e) => {
      const key = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}`;
      seen.add(key);
    });
    return Array.from(seen).sort();
  }, [visibleEvents]);

  const filteredEvents = useMemo(() => {
    return visibleEvents.filter((e) => {
      const genreMatch = selectedGenres.length === 0 || getGenres(e.genre).some((g) => selectedGenres.includes(g));
      const monthKey = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}`;
      const monthMatch = selectedMonth === null || monthKey === selectedMonth;
      return genreMatch && monthMatch;
    });
  }, [visibleEvents, selectedGenres, selectedMonth]);

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (!targetId || visibleEvents.length === 0) return;
    let tries = 0;
    const scrollToTarget = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = window.innerWidth <= 400 ? 64 : 70;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12, behavior: "smooth" });
        return;
      }
      if (++tries < 120) requestAnimationFrame(scrollToTarget);
    };
    requestAnimationFrame(scrollToTarget);
  }, [location.key, visibleEvents.length]);

  const renderMarkdown = (text) => {
    if (!text) return "";
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return escaped
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const getSpotifyEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/open\.spotify\.com\/(track|artist|album|playlist)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  };

  const getBillettoId = (event) => {
    if (event.billettoEventId) return String(event.billettoEventId);
    if (event.billettoId) return String(event.billettoId);
    const match = event.link?.match(/billetto\.se(?:\/[a-z]{2})?\/e\/[^/?#]*?-?(\d+)(?:[/?#]|$)/i);
    return match ? match[1] : null;
  };

  const formatDate = (date) =>
    date.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });

  if (loading) return <main><p role="status" aria-live="polite">Laddar evenemang...</p></main>;
  if (error) return <main><p role="alert">{error}</p></main>;

  return (
    <main id="main-content">
    <section id="events" className="evenemang-lokstallet">
      <div className="evenemang-container">
        <h2 className="evenemang-title">Vad händer på Lokstallet?</h2>
        <p className="evenemang-intro">Här hittar du aktuella evenemang och föreställningar.</p>

        {(genres.length > 1 || months.length > 1) && (
          <div className="filter-section">
            {months.length > 1 && (
              <div className="month-filter-wrap">
                <label htmlFor="month-filter" className="sr-only">Filtrera på månad</label>
                <select
                  id="month-filter"
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

            {genres.length > 1 && (
              <div className="genre-filter-bar" role="group" aria-label="Filtrera på genre">
                <button
                  type="button"
                  className={`genre-filter-btn ${selectedGenres.length === 0 ? "active" : ""}`}
                  aria-pressed={selectedGenres.length === 0}
                  onClick={() => setSelectedGenres([])}
                >
                  Alla
                </button>
                {genres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`genre-filter-btn ${selectedGenres.includes(g) ? "active" : ""}`}
                    aria-pressed={selectedGenres.includes(g)}
                    onClick={() => toggleGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="event-grid" aria-live="polite" aria-atomic="false">
          {filteredEvents.length === 0 && (
            <p className="no-events-msg">Inga evenemang matchar det valda filtret.</p>
          )}

          {filteredEvents.map((event) => {
            const billettoId = getBillettoId(event);
            const hasMoreText = [event.description, event.description2, event.description3].join("").length > 120;

            return (
              <article id={`event-${event.id}`} key={event.id} className="event-card">
                {/* BILD */}
                <div className="event-image-wrap">
                  {event.image
                    ? <img src={event.image} alt={event.title} loading="lazy" decoding="async" />
                    : <div className="event-image-placeholder" />
                  }
                </div>

                {/* INFO */}
                <div className="event-content">
                  <div className="event-genre-tags">
                    {getGenres(event.genre).map((g) => <span key={g} className="event-genre-tag">{g}</span>)}
                  </div>

                  <h3 className="event-heading">{event.title}</h3>

                  {event.subtitle && <p className="event-subtitle">{event.subtitle}</p>}

                  <div className="event-meta-row">
                    <span className="event-meta-item event-meta-date">{formatDate(event.date)}</span>
                    {event.time     && <span className="event-meta-item">{event.time}</span>}
                    {event.location && <span className="event-meta-item">{event.location}</span>}
                    {(event.price || event.organizer) && (
                      <div className="event-price-organizer-row">
                        <span className="event-meta-item event-price">{event.price || ""}</span>
                        {event.organizer && (
                          <span className="event-organizer">
                            Arrangör:{" "}
                            {event.organizerEmail
                              ? <a href={`mailto:${event.organizerEmail}`} className="event-organizer-link">{event.organizer}</a>
                              : event.organizer}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {(() => {
                    const links = Array.isArray(event.spotify)
                      ? event.spotify
                      : event.spotify ? [event.spotify] : [];
                    const first = links.map(getSpotifyEmbed).find(Boolean);
                    return first ? (
                      <div className="event-card-spotify">
                        <iframe
                          src={`${first}?theme=0`}
                          width="100%"
                          height="80"
                          style={{ border: "none", borderRadius: "8px", display: "block" }}
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
                          title={`Lyssna på ${event.title} på Spotify`}
                        />
                      </div>
                    ) : null;
                  })()}

                  {event.description && (
                    <div className="event-description">
                      <p dangerouslySetInnerHTML={{ __html: renderMarkdown(event.description) }} />
                    </div>
                  )}

                  <div className="event-actions">
                    {hasMoreText && (
                      <button
                        type="button"
                        className="more-info-btn"
                        aria-haspopup="dialog"
                        onClick={(e) => openModal(event, e.currentTarget)}
                      >
                        Mer information
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
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Skaffa biljetter till ${event.title} (öppnas i nytt fönster)`}
                        className="bt-l2"
                      >
                        Skaffa biljetter
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="arkiv-link-wrap">
          <Link to="/evenemang-lokstallet/arkiv" className="arkiv-link">
            Se tidigare evenemang →
          </Link>
        </div>
      </div>

      {/* ── MODAL via Portal (renderas direkt på body) ── */}
      {modalEvent && createPortal((() => {
        const billettoId = getBillettoId(modalEvent);
        return (
          <div className="event-modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true" aria-label={modalEvent.title}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <div className="event-modal-image">
                {modalEvent.image && <img src={modalEvent.image} alt={modalEvent.title} decoding="async" />}
                <button ref={modalCloseRef} className="event-modal-close" onClick={closeModal} aria-label="Stäng dialog">✕</button>
              </div>

              <div className="event-modal-body">
                <div className="event-genre-tags">
                  {getGenres(modalEvent.genre).map((g) => <span key={g} className="event-genre-tag">{g}</span>)}
                </div>

                <h2 className="event-modal-title">{modalEvent.title}</h2>
                {modalEvent.subtitle && <p className="event-subtitle">{modalEvent.subtitle}</p>}

                <div className="event-meta-row">
                  <span className="event-meta-item event-meta-date">{formatDate(modalEvent.date)}</span>
                  {modalEvent.time     && <span className="event-meta-item">{modalEvent.time}</span>}
                  {modalEvent.location && <span className="event-meta-item">{modalEvent.location}</span>}
                  {(modalEvent.price || modalEvent.organizer) && (
                    <div className="event-price-organizer-row">
                      <span className="event-meta-item event-price">{modalEvent.price || ""}</span>
                      {modalEvent.organizer && (
                        <span className="event-organizer">
                          Arrangör:{" "}
                          {modalEvent.organizerEmail
                            ? <a href={`mailto:${modalEvent.organizerEmail}`} className="event-organizer-link">{modalEvent.organizer}</a>
                            : modalEvent.organizer}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Spotify – under priset */}
                {(() => {
                  const links = Array.isArray(modalEvent.spotify)
                    ? modalEvent.spotify
                    : modalEvent.spotify ? [modalEvent.spotify] : [];
                  return links.length > 0 && (
                    <div className="event-spotify-list">
                      {links.map((url, i) => {
                        const embedUrl = getSpotifyEmbed(url);
                        return embedUrl ? (
                          <div key={i} className="event-spotify-wrap">
                            <iframe
                              src={`${embedUrl}?theme=0`}
                              width="100%"
                              height="152"
                              style={{ border: "none" }}
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
                              title={`Lyssna på Spotify ${i + 1}`}
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  );
                })()}

                <div className="event-modal-text">
                  {modalEvent.description  && <p dangerouslySetInnerHTML={{ __html: renderMarkdown(modalEvent.description) }} />}
                  {modalEvent.description2 && <p dangerouslySetInnerHTML={{ __html: renderMarkdown(modalEvent.description2) }} />}
                  {modalEvent.description3 && <p dangerouslySetInnerHTML={{ __html: renderMarkdown(modalEvent.description3) }} />}
                </div>


                {billettoId && billettoReady && (
                  <div className="billetto-widget-wrap" style={{ paddingTop: 0 }}>
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

                {!billettoId && modalEvent.link && (
                  <a
                    href={modalEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Skaffa biljetter till ${modalEvent.title} (öppnas i nytt fönster)`}
                    className="bt-l2"
                  >
                    Skaffa biljetter
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })(), document.body)}
    </section>
    </main>
  );
};

export default EvenemangLokstallet;
