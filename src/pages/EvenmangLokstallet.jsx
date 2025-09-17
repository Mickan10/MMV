import "./EvenmangLokstallet.css";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const EvenemangLokstallet = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));

      const eventList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Konvertera Firestore Timestamp till JS Date
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        };
      });

      // Sortera på datum
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
  today.setHours(0, 0, 0, 0); // jämför bara datum, inte tid

  // Filtrera bort event som är dolda eller redan passerade
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
          {visibleEvents.map((event) => (
            <article key={event.id} className="event-card">
              {event.image && (
                <img src={event.image} alt={event.title} className="event-img" />
              )}
              <div className="event-content">
                <h3 className="event-heading">{event.title}</h3>
              <p className="event-date">
                <span className="event-date-item">Datum: {event.date.toLocaleDateString()}</span>
                {event.time && <span className="event-date-item">Tid: {event.time}</span>}
                {event.location && <span className="event-date-item">Plats: {event.location}</span>}
              </p>
                <p className="event-description">{event.description}</p>
                {event.link && (
                  <a href={event.link} target="_blank" rel="noopener noreferrer">
                    <button className="bt-l2">Mer information/Biljetter</button>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EvenemangLokstallet;
