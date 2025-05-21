
import SocialMediaGallery from "../components/SocialMediaGallery.jsx";
import EventList from "../components/EventList.jsx";
import styles from "./MmvEvent.module.css";

export default function MmvEvent() {
  return (
    <>

      <SocialMediaGallery />

      <section className={styles.textSection}>
        <div className={styles.leftText}>
          <h3>Unika Evenemang för alla</h3>
          <p>
            Vårt mål på MMV Event är att skapa minnesvärda upplevelser som ligger på toppen av varje gästs lista. Vi har något för alla - från exklusiva middagar till galna festkvällar och inspirerande föreläsningar. Häng med oss och gör varje ögonblick oförglömligt!
          </p>
        </div>

        <div className={styles.rightText}>
          <h3>Varför välja MMV Event?</h3>
          <p>
            Vi erbjuder ett brett utbud av temafester, workshops och events som skräddarsys för att passa dina behov. Oavsett om du planerar ett företagsevent, bröllop eller privat fest, är vi här för att förverkliga dina visioner. Låt oss hjälpa dig att skapa en upplevelse som du och dina gäster aldrig kommer glömma!
          </p>
        </div>
      </section>

      <EventList />

    </>
  );
}
