import React from 'react';
import './LokalerLokstallet.module.css';

const lokalerData = [
  {
    title: 'Köket',
    text: 'Perfekt för matlagningsevent och mingel. Fullt utrustat kök och mysig atmosfär.',
    images: ['Bilder/gh4-1.jpg', 'Bilder/bild2 restu.jpg', 'Bilder/rest 3.jpg'],
  },
  {
    title: 'Lilla Scenen',
    text: 'En intim scen för mindre uppträdanden och möten.',
    images: ['Bilder/resturang.webp', 'Bilder/scen.jpg', 'Bilder/images.jpg'],
    reverse: true,
  },
  {
    title: 'Stora Scenen',
    text: 'Stor scen med professionellt ljud- och ljussystem.',
    images: ['Bilder/big_stage1.jpg', 'Bilder/big_stage2.jpg', 'Bilder/big_stage3.jpg'],
  },
  {
    title: 'Konferensrum',
    text: 'Modernt och välutrustat konferensrum för möten och workshops.',
    images: ['Bilder/conference1.jpg', 'Bilder/conference2.jpg', 'Bilder/conference3.jpg'],
    reverse: true,
  },
  {
    title: 'Hela Lokalen',
    text: 'Hyr hela lokalen för stora evenemang, fester eller företagsevent.',
    images: ['Bilder/whole_place1.jpg', 'Bilder/whole_place2.jpg', 'Bilder/whole_place3.jpg'],
  },
  {
    title: 'Dagskontor',
    text: 'Flexibla arbetsplatser med snabb WiFi och bekväm miljö.',
    images: ['Bilder/office1.jpg', 'Bilder/office2.jpg', 'Bilder/office3.jpg'],
    reverse: true,
  },
];

const LokalerLokstallet = () => {
  return (
    <main className="lokaler-container">
      <h1>Våra Lokaler</h1>
      {lokalerData.map((lokal, index) => (
        <section key={index} className={`lokal ${lokal.reverse ? 'reverse' : ''}`}>
          <div className="lokal-text">
            <h2>{lokal.title}</h2>
            <p>{lokal.text}</p>
          </div>
          <div className="lokal-bild">
            <div className="slideshow">
              {lokal.images.map((src, i) => (
                <img key={i} src={src} alt={`${lokal.title} ${i + 1}`} className={i === 0 ? 'active' : ''} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
};

export default LokalerLokstallet;
