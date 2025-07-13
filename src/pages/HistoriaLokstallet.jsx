import styles from "./HistoriaLokstallet.module.css";
import image1 from "../assets/55d73d6f-6f18-4cc8-bb49-43e1f403beaa.webp";
import image2 from "../assets/55d73d6f-6f18-4cc8-bb49-43e1f403beaa.webp";

export default function HistoriaLokstallet() {
  return (
    <section className={styles.container}>
      <div className={styles.inner}>
        {/* Första raden: bild vänster, text höger */}
        <div className={styles.row}>
          <div className={styles.imageBox}>
            <img src={image1} alt="Lokstallet historisk bild" />
          </div>
          <div className={styles.textBox}>
            <h2>Lokstallets historia</h2>
            <p>
            Mitt i hjärtat av Skövde ligger <strong>Lokstallet</strong>, en plats där rostiga räls möter nya minnen.  
            Här, där lok en gång pustade ut efter långa resor, får nu fester, bröllop och möten ta plats.  
            Lokstallet byggdes ursprungligen som en del av järnvägens pulsåder, en plats där tunga lok rullade in för service, vila och omstart.  
            Idag har byggnaden fått nytt liv – men utan att förlora sin själ.  
            Det gamla teglet viskar fortfarande om svunna tider, medan moderna detaljer, mjukt ljus och öppen atmosfär skapar en unik kontrast.
          </p>
          <p>
            Med respekt för historien och öga för framtiden har Lokstallet bevarats och förvandlats till en inspirerande miljö.  
            Här samlas människor för att fira, skapa och mötas – mitt bland spår av dåtid.  
            Vare sig det är en företagskonferens, en magisk bröllopsfest eller ett kulturevenemang, bjuder Lokstallet på en plats med karaktär, känsla och kraft.
          </p>

          </div>
        </div>

        {/* Andra raden: text vänster, bild höger */}
        <div className={styles.row}>
          <div className={styles.textBox}>
            <h2>En plats för fest och minnen</h2>
            <p>
              Den charmiga industribyggnaden har förvandlats till en <strong>unik och flexibel lokal</strong> för dig som söker något utöver det vanliga.  
              Tegelväggarna bär på historier, men rymmer också dans, dofter från catering, skratt och klirrande glas.
            </p>
              <p>
            Med respekt för historien och öga för framtiden har Lokstallet bevarats och förvandlats till en inspirerande miljö.  
            Här samlas människor för att fira, skapa och mötas – mitt bland spår av dåtid.  
            Vare sig det är en företagskonferens, en magisk bröllopsfest eller ett kulturevenemang, bjuder Lokstallet på en plats med karaktär, känsla och kraft.
          </p>
          </div>
          <div className={styles.imageBox}>
            <img src={image2} alt="Lokstallet fest" />
          </div>
        </div>
      </div>
    </section>
  );
}
