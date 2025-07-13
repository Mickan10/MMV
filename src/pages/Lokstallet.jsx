import React, { useState } from 'react';
import "./Lokstallet.css"; 
import { Link } from 'react-router-dom';

// Importera bilder från assets-mappen
import timo from '../assets/timo.png';
import img2 from '../assets/scen.jpg';
import img3 from '../assets/resturang.webp';
import img4 from '../assets/header.jpg';
import logoWebbVitMini from '../assets/Logo-webb-vit-mini.webp';

const Lokstallet = () => {
  const images = [img2, img3, img4, img4, img4, img4, img4, img3];
  const [startIndex, setStartIndex] = useState(0);
  const imagesToShow = 3; // Antal bilder som visas samtidigt

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, images.length - imagesToShow));
  };

  const visibleImages = images.slice(startIndex, startIndex + imagesToShow);

  return (
    <main>
      <div className="border"></div>

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
          <article className="event">
            <img src={img2} alt="Event 1" />
            <h3>Konsert: Bandnamn</h3>
            <p>Datum: 25 januari 2025</p>
            <button className="btn-l">Köp biljett</button>
          </article>
          <article className="event">
            <img src={img2} alt="Event 1" />
            <h3>Konsert: Bandnamn</h3>
            <p>Datum: 25 januari 2025</p>
            <button className="btn-l">Köp biljett</button>
          </article>
        </div>
      </section>

      <div className="border"></div>

      <section id="gallery" className="section">
        <h2>Lokstallet: En Oas För Kultur och Evenemang</h2>
        <div className="gallery-container">
          <button 
            className="gallery-prev" 
            onClick={handlePrev} 
            disabled={startIndex === 0}
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
            disabled={startIndex >= images.length - imagesToShow}
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
              <a href="https://sallskapetskovde.se/" target="_blank" rel="noreferrer">
                <img src={logoWebbVitMini} alt="Sponsor 1" />
                <div className="overlay">
                  Sällskapet i Skövde – Mat från Skaraborg & världen, lunch, á la carte, after work, brunch, fika, festlokal, mässor, livespelningar...
                </div>
              </a>
            </div>
            {/* eventuella fler sponsorer */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Lokstallet;
