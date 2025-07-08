import React, { useState, useEffect } from 'react';
import styles from './LokalerLokstallet.module.css';

const lokalerData = [
  {
    title: 'Köket',
    text: 'Perfekt för matlagningsevent och mingel. Fullt utrustat kök och mysig atmosfär.',
    images: ['src/assets/gh4-1.jpg', 'src/assets/bild2 restu.jpg', 'src/assets/scen.jpg'],
  },
  {
    title: 'Lilla Scenen',
    text: 'En intim scen för mindre uppträdanden och möten.',
    images: ['src/assets/gh4-1.jpg', 'src/assets/bild2 restu.jpg', 'src/assets/scen.jpg'],
  },
  {
    title: 'Stora Scenen',
    text: 'Stor scen med professionellt ljud- och ljussystem.',
    images: ['src/assets/gh4-1.jpg', 'src/assets/bild2 restu.jpg', 'src/assets/scen.jpg'],
  },
  {
    title: 'Konferensrum',
    text: 'Modernt och välutrustat konferensrum för möten och workshops.',
    images: ['src/assets/gh4-1.jpg', 'src/assets/bild2 restu.jpg', 'src/assets/scen.jpg'],
  },
  {
    title: 'Hela Lokalen',
    text: 'Hyr hela lokalen för stora evenemang, fester eller företagsevent.',
    images: ['src/assets/gh4-1.jpg', 'src/assets/bild2 restu.jpg', 'src/assets/scen.jpg'],
  },
  {
    title: 'Dagskontor',
    text: 'Flexibla arbetsplatser med snabb WiFi och bekväm miljö.',
    images: ['src/assets/gh4-1.jpg', 'src/assets/bild2 restu.jpg', 'src/assets/scen.jpg'],
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
        <section key={idx} className={styles.lokal}>
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
                className={`${styles['slide-image']} ${currentImages[idx] === i ? styles.visible : styles.hidden}`}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default LokalerLokstallet;
