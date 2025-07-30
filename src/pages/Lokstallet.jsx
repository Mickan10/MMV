import React, { useState, useRef } from "react";
import "./Lokstallet.css";
import { Link } from "react-router-dom";

import timo from "../assets/timo.png";
import img2 from "../assets/scen.jpg";
import img3 from "../assets/resturang.webp";
import img4 from "../assets/header.jpg";
import logoWebbVitMini from "../assets/Logo-webb-vit-mini.webp";

const Lokstallet = () => {
  const images = [img2, img3, img4, img2, img3, img4, img2, img3];
  const imagesToShow = 3;
  const [startIndex, setStartIndex] = useState(0);

  // Swipe state
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Loop-funktionalitet
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
    const minDistance = 50; // Minsta avstånd för swipe

    if (distance > minDistance) {
      // Swipe vänster -> nästa
      handleNext();
    } else if (distance < -minDistance) {
      // Swipe höger -> föregående
      handlePrev();
    }
    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const visibleImages = [];
  for (let i = 0; i < imagesToShow; i++) {
    visibleImages.push(images[(startIndex + i) % images.length]);
  }

  return (
    <main>
      <section id="events" className="section">
        <h2>Vad händer på Lokstallet?</h2>
        <p></p>
        <div className="events">
          <article className="event">
            <img src={timo} alt="Julen enligt Timo" />
            <h3>Lördag 6 dec. • Julen enligt Timo • Kulturaktiebolaget</h3>
            <a
              href="https://billetto.se/e/julen-enligt-timo-biljetter-1280249"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn-l">Mer information</button>
            </a>
          </article>

          <article className="event">
            <img src={img2} alt="Event 1" />
            <h3>Konsert: Bandnamn</h3>
            <p>Datum: 25 januari 2025</p>
            <button className="btn-l">Köp biljett</button>
          </article>
          {/* fler events */}
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
          <button
            className="gallery-prev"
            onClick={handlePrev}
            aria-label="Föregående"
          >
            &#10094;
          </button>

          <div className="gallery">
            {visibleImages.map((img, i) => (
              <img key={i} src={img} alt={`Bild ${startIndex + i + 1}`} />
            ))}
          </div>

          <button
            className="gallery-next"
            onClick={handleNext}
            aria-label="Nästa"
          >
            &#10095;
          </button>
        </div>

        <div className="gallery-button-container">
          <Link to="/lokaler" className="gallery-button">
            Läs mer om våra lokaler
          </Link>
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
                  carte, after work, brunch, fika, festlokal, mässor,
                  livespelningar...
                </div>
              </a>
            </div>
            {/* fler sponsorer */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Lokstallet;
