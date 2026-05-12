import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./EventPage.css";

function parseLocalDate(val) {
  if (!val) return null;
  if (val?.toDate) return val.toDate();
  const str = String(val).trim();
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(str);
}

function getBillettoId(event) {
  if (event.billettoEventId) return String(event.billettoEventId);
  if (event.billettoId) return String(event.billettoId);
  const match = event.link?.match(/billetto\.se(?:\/[a-z]{2})?\/e\/[^/?#]*?-?(\d+)(?:[/?#]|$)/i);
  return match ? match[1] : null;
}

function getGenres(genre) {
  if (!genre) return [];
  if (Array.isArray(genre)) return genre;
  return [genre];
}

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billettoReady, setBillettoReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const snap = await getDoc(doc(db, "events", id));
        if (snap.exists()) {
          const data = snap.data();
          const parsed = parseLocalDate(data.date);
          setEvent({ id: snap.id, ...data, date: parsed });
          // SEO
          document.title = `${data.title} – Lokstallet Skövde`;
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.content = data.description || `${data.title} på Lokstallet i Skövde.`;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event) return;
    const billettoId = getBillettoId(event);
    if (!billettoId) return;
    const src = "https://billetto.se/widget.js";
    if (document.querySelector(`script[src="${src}"]`)) {
      setBillettoReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => setBillettoReady(true);
    document.body.appendChild(script);
  }, [event]);

  if (loading) return <div className="event-page-loading">Laddar...</div>;
  if (!event) return (
    <div className="event-page-notfound">
      <p>Evenemanget hittades inte.</p>
      <Link to="/evenemang-lokstallet">← Tillbaka till evenemang</Link>
    </div>
  );

  const billettoId = getBillettoId(event);
  const formatDate = (date) =>
    date?.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <article className="event-page">
      {event.image && (
        <div className="event-page-hero">
          <img src={event.image} alt={event.title} />
        </div>
      )}

      <div className="event-page-container">
        <Link to="/evenemang-lokstallet" className="event-page-back">← Alla evenemang</Link>

        <div className="event-page-genres">
          {getGenres(event.genre).map((g) => (
            <span key={g} className="event-genre-tag">{g}</span>
          ))}
        </div>

        <h1 className="event-page-title">{event.title}</h1>
        {event.subtitle && <p className="event-page-subtitle">{event.subtitle}</p>}

        <div className="event-page-meta">
          {event.date && <span>{formatDate(event.date)}</span>}
          {event.time && <span>{event.time}</span>}
          {event.location && <span>{event.location}</span>}
          {event.price && <span className="event-page-price">{event.price}</span>}
        </div>

        <div className="event-page-description">
          {event.description  && <p>{event.description}</p>}
          {event.description2 && <p>{event.description2}</p>}
          {event.description3 && <p>{event.description3}</p>}
        </div>

        <div className="event-page-tickets">
          {billettoId && billettoReady && (
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
          )}
          {!billettoId && event.link && (
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              <button className="bt-l2">Skaffa biljetter</button>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
