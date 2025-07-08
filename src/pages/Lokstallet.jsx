import "./Lokstallet.css"; 
import { Link } from 'react-router-dom';

// Importera bilder från assets-mappen
import eventImg from '../assets/55d73d6f-6f18-4cc8-bb49-43e1f403beaa.webp';
import img1 from '../assets/images.jpg';
import img2 from '../assets/scen.jpg';
import img3 from '../assets/resturang.webp';
import img4 from '../assets/header.jpg';
import logoWebbVitMini from '../assets/Logo-webb-vit-mini.webp';
{/*import sponsor2 from '../assets/sponsor2.png';
import sponsor3 from '../assets/sponsor3.png';
import sponsor4 from '../assets/sponsor4.png';*/}

const Lokstallet = () => {
  return (
    <main>
      <div className="border"></div>

      <section id="events" className="section">
        <h2>Vad händer på Lokstallet?</h2>
        <div className="events">
          <article className="event">
            <img src={eventImg} alt="Event 1" />
            <h3>Konsert: Bandnamn</h3>
            <p>Datum: 25 januari 2025</p>
            <button className="btn-l">Köp biljett</button>
          </article>
          <article className="event">
            <img src={eventImg} alt="Event 2" />
            <h3>Teater: Föreställningsnamn</h3>
            <p>Datum: 10 februari 2025</p>
            <button className="btn-l">Köp biljett</button>
          </article>
          <article className="event">
            <img src={eventImg} alt="Event 3" />
            <h3>Konsert: Bandnamn</h3>
            <p>Datum: 25 januari 2025</p>
            <button className="btn-l">Köp biljett</button>
          </article>
          <article className="event">
            <img src={eventImg} alt="Event 4" />
            <h3>Teater: Föreställningsnamn</h3>
            <p>Datum: 10 februari 2025</p>
            <button className="btn-l">Köp biljett</button>
          </article>
        </div>
      </section>

      <div className="border"></div>

      <section id="gallery" className="section">
        <h2>Lokstallet: En Oas För Kultur och Evenemang</h2>
        <div className="gallery-container">
          <button className="gallery-prev" id="prev">&#10094;</button>
          <div className="gallery">
            <img src={img1} alt="Bild 1" />
            <img src={img2} alt="Bild 2" />
            <img src={img1} alt="Bild 3" />
            <img src={img3} alt="Bild 4" />
            <img src={img4} alt="Bild 5" />
            <img src={img4} alt="Bild 6" />
            <img src={img4} alt="Bild 7" />
            <img src={img4} alt="Bild 8" />
            <img src={img4} alt="Bild 9" />
            <img src={img3} alt="Bild 10" />
          </div>
          <button className="gallery-next" id="next">&#10095;</button>
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
            {/*<div className="sponsor">
              <img src={sponsor2} alt="Sponsor 2" />
              <div className="overlay">Om Sponsor 2</div>
            </div>
            <div className="sponsor">
              <img src={sponsor3} alt="Sponsor 3" />
              <div className="overlay">Om Sponsor 3</div>
            </div>
            <div className="sponsor">
              <img src={sponsor4} alt="Sponsor 4" />
              <div className="overlay">Om Sponsor 4</div>
            </div>*/}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Lokstallet;
