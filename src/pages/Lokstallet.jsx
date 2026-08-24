import { useState, useEffect, useRef, useCallback } from "react";
import "./Lokstallet.css";
import { usePageMeta } from "../hooks/usePageMeta";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import img3 from "../assets/loklokal.jpg";
import img9 from "../assets/lokstalletheader.png";
import imgTestlokis from "../assets/testlokis.jpg";

function ReviewsSection({ reviews }) {
  if (reviews.length === 0) return null;

  return (
    <section className="reviews-section section-fade">
      <div className="reviews-container">
        <div className="inner-deco reviews-heading">
          <h3>Vad våra gäster säger</h3>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-stars" aria-label={`${review.rating} av 5 stjärnor`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`review-star ${i < review.rating ? "filled" : ""}`}>★</span>
                ))}
              </div>
              <p className="review-text">&ldquo;{review.text}&rdquo;</p>
              <p className="review-author">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Lägg till fler bilder här ──
const CAROUSEL_IMAGES = [
  { src: img3,        alt: "Lokstallets lokaler" },
  { src: imgTestlokis, alt: "Lokstallet – interiör" },
  { src: img9,        alt: "Lokstallet" },
];

function ImageCarousel() {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = CAROUSEL_IMAGES.length;

  const prev = useCallback(() => setOffset((o) => (o - 1 + count) % count), [count]);
  const next = useCallback(() => setOffset((o) => (o + 1) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

  // Bygg upp en loop med 5 synliga positioner (vänster-2, vänster-1, center, höger-1, höger-2)
  const getImg = (delta) => CAROUSEL_IMAGES[(offset + delta + count) % count];

  return (
    <section className="carousel-section" aria-label="Bildgalleri">
      <div
        className="carousel-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {[-1, 0, 1].map((delta) => {
          const img = getImg(delta);
          const pos = delta === 0 ? "center" : delta === -1 ? "left" : "right";
          return (
            <div key={offset + delta} className={`carousel-item carousel-item--${pos}`}>
              <img src={img.src} alt={img.alt} />
            </div>
          );
        })}

        <button className="carousel-btn carousel-btn--prev" onClick={prev} aria-label="Föregående bild">‹</button>
        <button className="carousel-btn carousel-btn--next" onClick={next} aria-label="Nästa bild">›</button>
      </div>
    </section>
  );
}

const Lokstallet = () => {
  usePageMeta("Din scen i Skövde", "Lokstallet – en unik kulturlokal i Skövde för konserter, teater, föreläsningar och privata evenemang.");
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const lineRef = useRef(null);

  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reviews"));
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    let eventList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
      const da = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dbb = b.date?.toDate ? b.date.toDate() : new Date(b.date);

      da.setHours(0, 0, 0, 0);
      dbb.setHours(0, 0, 0, 0);

      const diff = da - dbb;
      if (diff !== 0) return diff;

      return toMinutes(a.time) - toMinutes(b.time);
    });

    setEvents(eventList);
  };

  useEffect(() => {
    fetchEvents();
    fetchReviews();
  }, []);

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

    const dateObj = event.date?.toDate ? event.date.toDate() : new Date(event.date);
    return dateObj >= today;
  });

  const featuredEvents = visibleEvents.slice(0, 6);

  return (
    <main className="lokstallet-main">
      <section className="welcome-section section-fade">
        <div className="welcome-left">
          <img src={img9} alt="Lokstallet" className="welcome-logo" />
        </div>

        <div className="welcome-right">
          <p className="welcome-tagline">Musik. Evenemang. Möten.</p>
          <h2>Välkommen till Lokstallet</h2>
          <p>
            Lokstallet är en evenemangs och kulturscen i centrala Skövde. Här arrangeras konserter,
            föreställningar, företagsevent och privata tillställningar i en lokal som byggts om för
            konserter, evenemang och möten. Lokalen är öppen och flexibel med scen, bar, garderob,
            kök och modern teknik på plats.
          </p>
          <p>
            Utforska aktuella evenemang, hitta din nästa upplevelse eller upptäck möjligheterna med
            Lokstallet som eventlokal. Kontakta oss om du vill veta mer eller boka visning av lokalen.
          </p>

          <div className="welcome-actions">
            <Link to="/evenemang-lokstallet" className="hero-btn hero-btn-primary">
              Se aktuella evenemang
            </Link>
          </div>
        </div>
      </section>

      <section id="home-events" className="section-fade">
        <div className="home-events-container">
          <div className="home-events-header">
            <div ref={lineRef} className="inner-line">
              <h2>På scen hos oss</h2>
            </div>

            <Link to="/evenemang-lokstallet" className="home-event-btn">
              Se fler evenemang
            </Link>
          </div>

          <div className="home-events">
            {featuredEvents.length === 0 && (
              <p className="no-events-text">
                Just nu finns inga publicerade evenemang. Håll utkik – programmet uppdateras löpande.
              </p>
            )}

            {featuredEvents.map((event) => {
              const dateObj = event.date?.toDate ? event.date.toDate() : new Date(event.date);

              return (
                <article key={event.id} className="home-event">
                  {event.image && (
                    <img src={event.image} alt={event.title} className="home-event-img" />
                  )}

                  <div className="home-event-content">
                    <div className="home-event-date">
                      <span className="home-event-day">
                        {dateObj.toLocaleDateString("sv-SE", { day: "2-digit" })}
                      </span>
                      <span className="home-event-month">
                        {dateObj
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
                        state={{ scrollTo: `event-${event.id}` }}
                        className="homes-btn"
                      >
                        Läs mer & biljetter
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* <ImageCarousel /> */}

      <ReviewsSection reviews={reviews} />

      <section className="lokal-section section-fade">
        <div className="lokal-left">
          <div className="inner-deco">
            <h3>Lokalen</h3>
          </div>
          <p>
            Lokalen är utrustad med en större scen på 5 × 5 meter som kan byggas ut till 7 × 6 meter.
            I lokalen finns bar, garderob, kök, projektorer och sittplatser samt en mindre
            konferensdel på bottenplan.
          </p>
          <p>
            Bord och sittplatser möbleras utifrån behov och arrangemangets utformning. Det går att
            hyra hela lokalen, bottenplanet eller köket separat beroende på upplägg.
          </p>
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
