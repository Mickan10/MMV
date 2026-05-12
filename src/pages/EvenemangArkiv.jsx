import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./EvenemangArkiv.css";
import { usePageMeta } from "../hooks/usePageMeta";

function parseLocalDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function EvenemangArkiv() {
  usePageMeta("Tidigare evenemang", "Arkiv över tidigare konserter och evenemang på Lokstallet i Skövde.");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const past = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((e) => {
            if (e.hidden === true) return false;
            const d = parseLocalDate(e.date);
            return d && d < today;
          })
          .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date));

        setEvents(past);
      } catch (err) {
        console.error("Fetch archive error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="arkiv-page">
      <div className="arkiv-container">
        <div className="arkiv-header">
          <Link to="/evenemang-lokstallet" className="arkiv-back">← Kommande evenemang</Link>
          <h1 className="arkiv-title">Tidigare evenemang</h1>
          <p className="arkiv-intro">Här hittar du evenemang som tidigare har ägt rum på Lokstallet.</p>
        </div>

        {loading && <p className="arkiv-loading">Laddar…</p>}

        {!loading && events.length === 0 && (
          <p className="arkiv-empty">Inga tidigare evenemang hittades.</p>
        )}

        <div className="arkiv-grid">
          {events.map((event) => (
            <article key={event.id} className="arkiv-card">
              <div className="arkiv-card-image">
                {event.image
                  ? <img src={event.image} alt={event.title} loading="lazy" />
                  : <div className="arkiv-card-placeholder" />
                }
              </div>
              <div className="arkiv-card-info">
                <p className="arkiv-card-date">{event.date}</p>
                <h2 className="arkiv-card-title">{event.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
