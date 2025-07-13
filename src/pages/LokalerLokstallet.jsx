import React, { useState, useEffect } from 'react';
import styles from './LokalerLokstallet.module.css';

import gh4_1 from '../assets/gh4-1.jpg';
import restu from '../assets/restu.jpg';
import scen from '../assets/scen.jpg';

const lokalerData = [
  {
    title: 'Köket',
    text: 'Perfekt för matlagningsevent, mingel och workshops. Lokalen erbjuder ett fullt utrustat restaurangkök med stora arbetsytor, modern utrustning och en trivsam miljö för både små och stora sällskap. Köket är sammankopplat med serveringsytor vilket gör det perfekt för både kurser och privata matupplevelser.',
    images: [restu, gh4_1, scen],
  },
  {
    title: 'Lilla Scenen',
    text: 'Lilla scenen erbjuder en intim och flexibel yta för mindre uppträdanden, föreläsningar, samtal eller möten. Lokalen är utrustad med basljudsystem, justerbar belysning och möjlighet att möblera efter behov. Perfekt för akustiska spelningar, boklanseringar eller kreativa möten.',
    images: [gh4_1, restu, scen],
  },
  {
    title: 'Stora Scenen',
    text: 'Stora scenen är vår mest kraftfulla lokal med plats för både publik och artister. Här finns ett professionellt ljud- och ljussystem, hög scen, blackout-möjligheter och teknisk personal på begäran. Lokalen passar för konserter, teaterföreställningar, stand-up, lanseringar och stora föreläsningar.',
    images: [scen, gh4_1, restu],
  },
  {
    title: 'Konferensrum',
    text: 'Vårt moderna konferensrum är en ljus och trivsam lokal med plats för upp till 20 personer. Här finns projektor, whiteboard, konferensbord, ergonomiska stolar och snabbt WiFi. Perfekt för effektiva möten, strategidagar, utbildningar eller digitala presentationer.',
    images: [restu, gh4_1, scen],
  },
  {
    title: 'Hela Lokalen',
    text: 'För de riktigt stora tillfällena kan du boka hela lokalen. Det innebär tillgång till samtliga ytor – scen, kök, bar, foajé och konferensrum – och ger möjlighet att arrangera events med upp till 250 deltagare. Idealisk för bröllop, festivaler, företagsgalor eller mässor. Vi erbjuder även hjälp med planering, teknik och bemanning.',
    images: [scen, gh4_1, restu],
  },
  {
    title: 'Dagskontor',
    text: 'Behöver du en flexibel arbetsplats under dagen? Våra dagskontor erbjuder en tyst och professionell miljö med höj- och sänkbara skrivbord, bra belysning, WiFi, skrivare och kaffe. Lokalen lämpar sig för distansarbete, fokustid eller digitala möten och kan bokas per timme eller dag.',
    images: [gh4_1, restu, scen],
  },
];


const LokalerLokstallet = () => {
  const [currentImages, setCurrentImages] = useState(
    lokalerData.map(() => 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages((prev) =>
        prev.map((curr, i) => (curr + 1) % lokalerData[i].images.length)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles['lokaler-container']}>
      <h1>Våra Lokaler</h1>
      {lokalerData.map((lokal, idx) => (
  <React.Fragment key={idx}>
    <section className={styles.lokal}>
      <div className={styles['lokal-text']}>
        <h2>{lokal.title}</h2>
        <p>{lokal.text}</p>
      </div>
      <div className={styles['lokal-bild']}>
        {lokal.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${lokal.title} bild ${i + 1}`}
            className={`${styles['slide-image']} ${
              currentImages[idx] === i ? styles.visible : styles.hidden
            }`}
          />
        ))}
      </div>
    </section>
    {idx < lokalerData.length - 1 && (
      <hr className={styles['guld-linje']} />
    )}
  </React.Fragment>
))}
    </main>
  );
};

export default LokalerLokstallet;
