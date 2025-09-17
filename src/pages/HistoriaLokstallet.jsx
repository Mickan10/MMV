import styles from "./HistoriaLokstallet.module.css";
import historia1 from "../assets/historia.jpg";

export default function HistoriaLokstallet() {
  return (
    <section className={styles.container}>
      <div className={styles.inner}>
        <div className={styles["historia-section"]}>
          {/* Text vänster */}
          <div className={styles["historia-left"]}>
            <h2>Lokstallets historia</h2>
            <p>
              Mitt i hjärtat av Skövde ligger <strong>Lokstallet</strong>, en plats där rostiga räls möter nya minnen. Här, där lok en gång pustade ut efter långa resor, får nu fester, bröllop och möten ta plats.
            </p>
            <p>
              Lokstallet byggdes ursprungligen som en del av järnvägens pulsåder, en plats där tunga lok rullade in för service, vila och omstart. Idag har byggnaden fått nytt liv – men utan att förlora sin själ.
            </p>
            <p>
              Med respekt för historien och öga för framtiden har Lokstallet bevarats och förvandlats till en inspirerande miljö. Här samlas människor för att fira, skapa och mötas – mitt bland spår av dåtid.
            </p>
          </div>

          {/* Bild höger */}
          <div className={styles["historia-center"]}>
            <img src={historia1} alt="Lokstallet historisk bild" />
          </div>
        </div>
      </div>
    </section>
  );
}
