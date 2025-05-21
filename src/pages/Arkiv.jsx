import "./Arkiv.css";
import varainrock from "../assets/varainrock.avif";
import varklubben from "../assets/vårklubben.jpg";
import skaraborgrockn from "../assets/skaraborgrockn.avif";
import uno from "../assets/uno.jpg";
import skarahotell from "../assets/skarahotell.webp";

const Arkiv = () => {
  return (
    <>
      <hr />

      <section id="customer-cases">
        <h2>Tidigare Evenemang och Framgångshistorier</h2>
        <div className="cases-container">
          <div className="case-item">
            <div className="case-image">
              <img
                src={varainrock}
                alt="Vara in Rock"
                className="event-image"
              />
            </div>
            <div className="case-content">
              <h3>Vara konserthus – Vara in Rock</h3>
              <p>
                En fantastisk rockfestival som satte Vara konserthus på kartan.
                Evenemanget bjöd på en grym line-up och en oförglömlig atmosfär.
              </p>
              <a href="https://www.varakonserthus.se/evenemang/vara-in-rock-festival/">
                Läs mer
              </a>
            </div>
          </div>

          <div className="case-item">
            <div className="case-image">
              <img
                src={varklubben}
                alt="Sällskapet Skövde – Vårklubben"
                className="event-image"
              />
            </div>
            <div className="case-content">
              <h3>Sällskapet Skövde – Vårklubben</h3>
              <p>
                En härlig vårfest som lockade både gamla och nya besökare.
                Vårklubben var en succé och satte verkligen stämningen för våren!
              </p>
            </div>
          </div>

          <div className="case-item">
            <div className="case-image">
              <img
                src={skaraborgrockn}
                alt="Skaraborg Rock 'n Rollfest - Gröna Lund Lerdala"
                className="event-image"
              />
            </div>
            <div className="case-content">
              <h3>Skaraborg Rock 'n Rollfest - Gröna Lund Lerdala</h3>
              <p>
                En episk rock’n’roll-fest på Gröna Lund Lerdala som drog enorma
                mängder besökare. Vår del av eventet var en total succé!
              </p>
            </div>
          </div>

          <div className="case-item">
            <div className="case-image">
              <img
                src={uno}
                alt="Jubileumsteatern – Uno Svenningsson"
                className="event-image"
              />
            </div>
            <div className="case-content">
              <h3>Jubileumsteatern – Uno Svenningsson</h3>
              <p>
                En intim och magisk kväll med Uno Svenningsson på Jubileumsteatern.
                Föreställningen var en stor succé och en minnesvärd upplevelse för
                alla närvarande.
              </p>
            </div>
          </div>

          <div className="case-item">
            <div className="case-image">
              <img
                src={skarahotell}
                alt="Skara Stadshotell"
                className="event-image"
              />
            </div>
            <div className="case-content">
              <h3>Skara Stadshotell</h3>
              <p>
                Skara Stadshotell var värd för ett exklusivt evenemang som
                kombinerade lyx och kultur. Gästerna njöt av en kväll med både mat
                och underhållning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Arkiv;
