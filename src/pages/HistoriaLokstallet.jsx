import styles from "./HistoriaLokstallet.module.css";
import image1 from "../assets/55d73d6f-6f18-4cc8-bb49-43e1f403beaa.webp";
import image2 from "../assets/55d73d6f-6f18-4cc8-bb49-43e1f403beaa.webp";
 

export default function HistoriaLokstallet() {
  return (
    <section className={styles.container}>
      
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
        </div>
        <div className={styles.imageBox}>
          <img src={image2} alt="Lokstallet fest" />
        </div>
      </div>
    </section>
  );
}
