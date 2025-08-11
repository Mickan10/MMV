import "./EvenmangLokstallet.css";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const EvenemangLokstallet = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    let eventList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    eventList.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sortera på datum
    setEvents(eventList);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrera bort event som är dolda (hidden === true)
  const visibleEvents = events.filter(event => !event.hidden);

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
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-img"
                />
              )}
              <div className="event-content">
              <h3 className="event-heading">{event.title}</h3>
              <p className="event-date">{event.date}</p>
              <p className="event-description">{event.description}</p>
              {event.link && (
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  <button className="btn-l">Mer information/Biljetter</button>
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
