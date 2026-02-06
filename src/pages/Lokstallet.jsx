import React, { useState, useEffect, useRef } from "react";
import "./Lokstallet.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import img3 from "../assets/loklokal.jpg";
import img9 from "../assets/lokstalletheader.png";

const Lokstallet = () => {
  const [events, setEvents] = useState([]);
  const lineRef = useRef(null);

  // Hämta events från Firestore
  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    let eventList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Sortera på datum om det finns
    const toMinutes = (t) => {
  if (!t) return 9999; // saknar tid → sist samma dag
  const s = String(t).trim().replace(".", ":"); // stöd "19.30"
  const [hh, mm] = s.split(":");
  const h = Number(hh);
  const m = Number(mm ?? 0);
  if (Number.isNaN(h) || Number.isNaN(m)) return 9999;
  return h * 60 + m;
};

eventList.sort((a, b) => {
  const da =
    a.date?.toDate ? a.date.toDate() : new Date(a.date);
  const db =
    b.date?.toDate ? b.date.toDate() : new Date(b.date);

  // jämför bara datum (inte tid)
  da.setHours(0, 0, 0, 0);
  db.setHours(0, 0, 0, 0);

  const diff = da - db;
  if (diff !== 0) return diff;

  // samma datum → sortera på tid
  return toMinutes(a.time) - toMinutes(b.time);
});


    setEvents(eventList);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Scroll-animation för sektioner och rubrikblock
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".section-fade, .inner-line");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visibleEvents = events.filter((event) => {
      if (event.hidden) return false;

      const date =
        event.date?.toDate ? event.date.toDate() : new Date(event.date);

      return date >= today;
    });

    const featuredEvents = visibleEvents.slice(0, 6);


  return (
    <main className="lokstallet-main">
      {/* -------- HERO / WELCOME -------- */}
      <section className="welcome-section section-fade">
        <div className="welcome-left">
          {/* Bakgrundsbild ligger i CSS, här visar vi logga/poster */}
          <img src={img9} alt="Lokstallet" className="welcome-logo" />
        </div>

        <div className="welcome-right">
          <p className="welcome-tagline">Musik. Evenemang. Möten.</p>
          <h3>Välkommen till Lokstallet</h3>
          <p>
            Lokstallet är en evenemangs och kulturscen i centrala Skövde. Här arrangeras konserter, föreställningar, företagsevent och privata tillställningar i en lokal som byggts om för konserter, evenemang och möten.
            Lokalen är öppen och flexibel med scen, bar, garderob, kök och modern teknik på plats. Rummet kan anpassas efter arrangemanget, från konserter och klubbar till konferenser och privata evenemang.
          </p>
          <p>
            Utforska aktuella evenemang, hitta din nästa upplevelse eller upptäck möjligheterna med Lokstallet som eventlokal. Kontakta oss om du vill veta mer eller boka visning av lokalen.
          </p>
          <div className="welcome-actions">
            <Link to="/evenemang-lokstallet" className="hero-btn hero-btn-primary">
              Se aktuella evenemang
            </Link>
          {/*}  <Link to="/lokaler" className="hero-btn hero-btn-ghost">
              Läs mer om lokalerna
            </Link>*/}
          </div>
        </div>
      </section>

      {/* -------- EVENT-TEASER -------- */}
      <section id="home-events" className="section-fade">
        <div className="home-events-container">
          <div className="home-events-header">
            <div ref={lineRef} className="inner-line">
              <h2>På scen hos oss</h2>
            </div>

            <Link to="/evenemang-lokstallet" className="homes-btn">
              Se fler evenemang
            </Link>
          </div>

          <div className="home-events">
            {featuredEvents.length === 0 && (
              <p className="no-events-text">
                Just nu finns inga publicerade evenemang. Håll utkik – programmet
                uppdateras löpande.
              </p>
            )}

            {featuredEvents.map((event) => (
              <article key={event.id} className="home-event">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="home-event-img"
                  />
                )}

                <div className="home-event-content">
                  <div className="home-event-date">
                    <span className="home-event-day">
                      {new Date(event.date).toLocaleDateString("sv-SE", {
                        day: "2-digit",
                      })}
                    </span>
                    <span className="home-event-month">
                      {new Date(event.date)
                        .toLocaleDateString("sv-SE", { month: "short" })
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="home-event-info">
                    <h3 className="home-event-title">{event.title}</h3>
                    {event.description && (
                      <p className="home-event-desc">
                        {event.description.length > 120
                          ? event.description.substring(0, 120) + "..."
                          : event.description}
                      </p>
                    )}

                    <Link
                      to="/evenemang-lokstallet"
                      className="homes-btn"
                    >
                      Läs mer & biljetter
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------- LOKALER -------- */}
      <section className="lokal-section section-fade">
        <div className="lokal-left">
          <div className="inner-deco">
            <h3>Musik. Evenemang. Möten.</h3>
          </div>
            <p>
            Lokstallet är en evenemangs och kulturscen i centrala Skövde, skapad av arrangörer för arrangörer. Lokalen är flexibel och fullt utrustad med kapacitet för upp till 500 stående gäster, och byggd för att fungera för konserter, möten och egna arrangemang.
            </p>
            <p>
            Ambitionen är att skapa en plats där det är enkelt att genomföra idéer, oavsett om det handlar om en publik konsert, ett företagsevent eller ett privat arrangemang.
            Vill du använda Lokstallet för ett eget arrangemang är du välkommen att kontakta oss.
            </p>
          {/*<Link to="/lokaler" className="lokal-btn">
            Utforska lokalerna
          </Link>*/}
        </div>

        <div className="lokal-center">
          <div className="lokal-image-wrap">
            <img src={img3} alt="Lokstallets lokaler" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Lokstallet;
