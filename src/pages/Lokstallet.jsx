import React, { useState, useEffect, useRef } from "react";
import "./Lokstallet.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import img2 from "../assets/scen.jpg";
import img3 from "../assets/resturang.webp";
import img4 from "../assets/header.jpg";
import logoWebbVitMini from "../assets/Logo-webb-vit-mini.webp";

const Lokstallet = () => {
  const [events, setEvents] = useState([]);

  const images = [img2, img3, img4, img2, img3, img4, img2, img3];
  const imagesToShow = 3;
  const [startIndex, setStartIndex] = useState(0);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? images.length - imagesToShow : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev === images.length - imagesToShow ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minDistance = 50;

    if (distance > minDistance) {
      handleNext();
    } else if (distance < -minDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const visibleImages = [];
  for (let i = 0; i < imagesToShow; i++) {
    visibleImages.push(images[(startIndex + i) % images.length]);
  }

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
      <section id="events" className="section">
        <h2>Vad händer på Lokstallet?</h2>
        <div className="events">
          {visibleEvents.length === 0 && <p>Inga aktuella evenemang att visa.</p>}
          {visibleEvents.map((event) => (
            <article key={event.id} className="event">
              {event.image && <img src={event.image} alt={event.title} />}
            <h3>
                <span className="event-meta">
                  {event.date} {event.time ? "• " + event.time : ""}
                </span>
                <span className="event-title">{event.title}</span>
            </h3>

            <Link to="/EvenemangLokstallet" className="btn-l">
              Biljetter / Mer info
            </Link>
            </article>
          ))}
        </div>
      </section>

      <div className="border"></div>

      <section id="gallery" className="section">
        <h2>Lokstallet: En Oas För Kultur och Evenemang</h2>
        <div
          className="gallery-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="gallery-prev" onClick={handlePrev} aria-label="Föregående">
            &#10094;
          </button>

          <div className="gallery">
            {visibleImages.map((img, i) => (
              <img key={i} src={img} alt={`Bild ${startIndex + i + 1}`} />
            ))}
          </div>

          <button className="gallery-next" onClick={handleNext} aria-label="Nästa">
            &#10095;
          </button>
        </div>
      </section>

      <div className="border"></div>

      <section className="sponsors">
        <h2>Våra Samarbetspartners</h2>
        <div className="sponsors-container">
          <div className="logos">
            <div className="sponsor">
              <a
                href="https://sallskapetskovde.se/"
                target="_blank"
                rel="noreferrer"
              >
                <img src={logoWebbVitMini} alt="Sponsor 1" />
                <div className="overlay">
                  Sällskapet i Skövde – Mat från Skaraborg & världen, lunch, á la
                  carte, after work, brunch, fika, festlokal, mässor, livespelningar...
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Lokstallet;
