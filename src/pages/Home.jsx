import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import mmvFront from "../assets/mmv-front.png";
import lokBild from "../assets/lokfrontbild.jpg";
import eventBild from "../assets/eventfront.jpg";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div
          className={styles.overlay}
          style={{
            backgroundImage: `url(${lokBild})`,
          }}
        >
          <h2>Lokstallet</h2>
          <p>Musik • Evenemang • Möten</p>
          <Link to="/lokstallet" className={styles.button}>
            Gå till Lokstallet
          </Link>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div
          className={styles.overlay}
          style={{
            backgroundImage: `url(${eventBild})`,
          }}
        >
          <img src={mmvFront} alt="MMV Event Bild" className={styles.mmvFront} />
          <Link to="/mmvevent" className={styles.button}>
            Gå till MMV Event
          </Link>
        </div>
      </div>
    </div>
  );
}
