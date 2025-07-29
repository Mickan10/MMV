import "./EvenmangLokstallet.css";
import timo from "../assets/timo.png";

const EvenmangLokstallet = () => {
  return (
    <section id="events" className="evenemang-lokstallet">
      <div className="evenemang-container">
        <h2 className="evenemang-title">Vad händer på Lokstallet?</h2>
        <p className="evenemang-intro">
          Här hittar du aktuella evenemang och föreställningar.
        </p>

        <div className="event-grid">
          <article className="event-card">
            <img src={timo} alt="Julen enligt Timo" className="event-img" />
            <div className="event-content">
              <h3 className="event-heading">
                Lördag 6 dec. • Julen enligt Timo • Kulturaktiebolaget
              </h3>
              <p className="event-description">
                Timo Räisänen har tagit alla bra jullåtar (och några dåliga) till sin spets i ett enkelt format. Med en ensam gitarr och sin egensinniga stämma blandar han och ger vackra och stökiga sånger i julens avigaste konsert - Julen enligt Timo.
              </p>
              <a
                href="https://billetto.se/e/julen-enligt-timo-biljetter-1280249"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-l">Mer information</button>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default EvenmangLokstallet;
