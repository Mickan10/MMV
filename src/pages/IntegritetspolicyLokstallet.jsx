import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import "./IntegritetspolicyLokstallet.css";

export default function IntegritetspolicyLokstallet() {
  usePageMeta("Integritetspolicy", "Lokstallet Skövdes integritetspolicy – hur vi hanterar dina personuppgifter.");

  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Integritetspolicy</h1>
        <p className="policy-updated">Senast uppdaterad: juli 2025</p>

        <section>
          <h2>1. Personuppgiftsansvarig</h2>
          <p>
            Lokstallet Skövde<br />
            Drottninggatan 17, 541 51 Skövde<br />
            E-post: <a href="mailto:info@lokstallett.se">info@lokstallett.se</a><br />
            Organisationsnummer: <strong>556897-9149</strong>
          </p>
        </section>

        <section>
          <h2>2. Vilka uppgifter samlar vi in?</h2>
          <p>Vi samlar in personuppgifter i följande situationer:</p>
          <ul>
            <li><strong>Kontaktformulär</strong> – namn och e-postadress när du skickar ett meddelande till oss.</li>
            <li><strong>Cookies och spårning</strong> – se avsnitt 6 nedan.</li>
            <li><strong>Biljettköp</strong> – om du köper biljett via Billetto hanteras dina uppgifter av Billetto i enlighet med deras integritetspolicy.</li>
          </ul>
        </section>

        <section>
          <h2>3. Varför samlar vi in uppgifterna?</h2>
          <ul>
            <li><strong>Kontaktförfrågningar</strong> – för att kunna besvara ditt meddelande. Rättslig grund: berättigat intresse (att kommunicera med de som kontaktar oss).</li>
            <li><strong>Marknadsföring</strong> – om du har samtyckt till marknadsföringscookies används Meta Pixel för att mäta räckvidd via sociala medier. Rättslig grund: samtycke.</li>
          </ul>
        </section>

        <section>
          <h2>4. Hur länge sparar vi uppgifterna?</h2>
          <ul>
            <li><strong>Kontaktformulär</strong> – uppgifterna sparas i vår e-postinkorg så länge de är relevanta, och raderas senast efter 12 månader.</li>
            <li><strong>Cookie-samtycke</strong> – ditt val sparas lokalt i din webbläsare (localStorage) tills du rensar det.</li>
          </ul>
        </section>

        <section>
          <h2>5. Tredjeparter vi delar data med</h2>
          <ul>
            <li><strong>Google / Firebase</strong> – vi använder Firebase (Google) för driften av hemsidan och inloggning för administratörer. Data kan lagras inom EU/EES. Läs mer: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">firebase.google.com/support/privacy</a></li>
            <li><strong>Google Fonts</strong> – typsnitt laddas från Googles servrar, vilket innebär att din IP-adress kan skickas till Google.</li>
            <li><strong>Meta (Facebook)</strong> – om du accepterar marknadsföringscookies laddas Meta Pixel som skickar anonymiserad data om sidbesök till Meta. Läs mer: <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a></li>
            <li><strong>Billetto</strong> – biljettförsäljning hanteras av Billetto. Läs mer: <a href="https://billetto.se/privacy" target="_blank" rel="noopener noreferrer">billetto.se/privacy</a></li>
          </ul>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>Vi använder cookies i tre kategorier:</p>
          <ul>
            <li><strong>Nödvändiga</strong> – Firebase-cookies som krävs för att hemsidan ska fungera. Dessa kan inte stängas av.</li>
            <li><strong>Marknadsföring</strong> – Meta Pixel (Facebook). Laddas endast om du har accepterat cookies.</li>
            <li><strong>Tredjepartswidgetar</strong> – Billetto-widget för biljettköp, som kan sätta egna cookies.</li>
          </ul>
          <p>Du kan när som helst ändra ditt cookie-val genom att rensa din webbläsares lokala lagring och ladda om sidan.</p>
        </section>

        <section>
          <h2>7. Dina rättigheter</h2>
          <p>Enligt GDPR har du rätt att:</p>
          <ul>
            <li>Begära tillgång till de personuppgifter vi har om dig</li>
            <li>Begära rättelse av felaktiga uppgifter</li>
            <li>Begära radering av dina uppgifter ("rätten att bli bortglömd")</li>
            <li>Invända mot behandling som grundas på berättigat intresse</li>
            <li>Lämna in klagomål till Integritetsskyddsmyndigheten (IMY): <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer">imy.se</a></li>
          </ul>
          <p>Kontakta oss på <a href="mailto:info@lokstallett.se">info@lokstallett.se</a> för att utöva dina rättigheter.</p>
        </section>

        <p className="policy-back">
          <Link to="/">← Tillbaka till startsidan</Link>
        </p>
      </div>
    </div>
  );
}
