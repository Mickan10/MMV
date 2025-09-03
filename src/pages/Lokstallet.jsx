import React, { useState, useEffect} from "react";
import "./Lokstallet.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import img3 from "../assets/resturang.webp";
import img9 from "../assets/lokstalletheader.png";
{/*import logga from '../assets/headerlok.png';*/}

const Lokstallet = () => {
  const [events, setEvents] = useState([]);

  // Hämta events från Firestore
  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    let eventList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    eventList.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(eventList);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const visibleEvents = events.filter(event => !event.hidden);

  return (
    <main>
  {/* ---------------- WELCOME HEADER / LOGO ---------------- */}
  {/*<header className="home-header">
    <img src={logga} alt="Lokstallet logo" className="home-logo" />
  </header>*/}

  {/* ---------------- WELCOME SECTION ---------------- */}
  <section className="welcome-section">
    <div className="welcome-left">
      <img src={img9} alt="Lokstallet" />
    </div>
    <div className="welcome-right">
      <h3>Välkommen till </h3>
      <h3>Lokstallet</h3>
      <p>
        Lokstallet är Skövdes hjärta för kultur och evenemang. Här
        hittar du allt från konserter och teaterföreställningar till
        workshops och matupplevelser. Vi erbjuder en unik miljö med
        historia och modern komfort.
      </p>
      <p>
        Utforska vårt program, boka biljetter och upplev
        oförglömliga stunder hos oss!
      </p>
    </div>
  </section>

  {/* ---------------- EVENTS SECTION ---------------- */}
    <section id="home-events">
  <div className="home-events-container">
    <div className="home-events-header">
      <h2>Event</h2>
      <p>Se vad som händer. </p>
      <Link to="/evenemang-lokstallet" className="home-btn">
        Se alla evenemang
      </Link>
    </div>
    <div className="home-events">
      {visibleEvents.map((event) => (
      <article key={event.id} className="home-event">
        {event.image && <img src={event.image} alt={event.title} className="home-event-img" />}
        <div className="home-event-content">
          <div className="home-event-date">
            <span className="home-event-day">
              {new Date(event.date).toLocaleDateString('sv-SE', { day: '2-digit' })}
            </span>
            <span className="home-event-month">
              {new Date(event.date).toLocaleDateString('sv-SE', { month: 'short' }).toUpperCase()}
            </span>
          </div>
          <div className="home-event-info">
            <h3 className="home-event-title">{event.title}</h3>
            {event.description && (
              <p className="home-event-desc">
                {event.description.length > 100 
                  ? event.description.substring(0, 100) + "..." 
                  : event.description}
              </p>
            )}
            <Link to={`/evenemang-lokstallet/:id${event.id}`} className="home-btn">
            Läs mer
          </Link>
          </div>
        </div>
      </article>

      ))}
    </div>
  </div>
</section>

  {/* ---------------- LOKAL SECTION ---------------- */}
  <section className="lokal-section">
    <div className="lokal-left">
      <h3>Din plats. Din upplevelse. Ditt Lokstall.</h3>
      <p>
        Hos oss hittar du en lokal med historia, atmosfär och modern komfort.
        Perfekt för allt från konserter och teater till bröllop, fester och konferenser.
      </p>
    </div>
    <div className="lokal-center">
      <img src={img3} alt="Lokal" />
    </div>
  </section>
</main>

  );
};

export default Lokstallet;
