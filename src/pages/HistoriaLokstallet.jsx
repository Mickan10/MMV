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
            Namnet <strong>Lokstallet</strong> är en påminnelse om hur järnvägen en gång formade stadens puls. Fastighetsbeteckningen är Lokstallet 1. Det ursprungliga lokstallet låg inte precis på den plats där den nya scenen byggs, men alldeles nära, på andra sidan järnvägen där Skolgatan slutar, vid Kavelbrovägen — nu platsen för Volvos hus med det sågtandade taket.
          </p>
          <p>
            Det gamla lokstallet uppfördes på 1870-talet i tegel med stallplatser, vattentorn, övernattningsrum och förråd. Under åren byggdes det ut — bland annat 1888 då ytterligare stallplatser tillkom.
          </p>
          <p>
            Som en blinkning till historien har vi också designat den nya takhuven med inspiration från gamla ånglok. En liten detalj som knyter ihop det förflutna med det vi skapar idag.
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
