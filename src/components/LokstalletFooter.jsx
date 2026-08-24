import { Link } from "react-router-dom";
import "./LokstalletFooter.css";
import logo from '../assets/lokstalletheader.png';
import { FacebookIcon, InstagramIcon } from "./SocialIcons.jsx";


export default function LokstalletFooter() {
  return (
    <footer className="lokstallet-footer">
      <div className="lokstallet-footer-container">
        <div className="lokstallet-footer-logo-container">
        <img src={logo} alt="Lokstallet Logo" className="lokstallet-logo-fot" />
      </div>

        <div className="lokstallet-footer-section lokstallet-footer-about">
          <h3>Om Lokstallet</h3>
          <p>
          Lokstallet är en evenemangs och kulturscen i centrala Skövde, skapad av arrangörer för arrangörer. Lokalen är flexibel och fullt utrustad med kapacitet för upp till 500 stående gäster, och byggd för att fungera för konserter, möten och egna arrangemang.
          Ambitionen är att skapa en plats där det är enkelt att genomföra idéer, oavsett om det handlar om en publik konsert, ett företagsevent eller ett privat arrangemang.
          Vill du använda Lokstallet för ett eget arrangemang är du välkommen att kontakta oss.
          </p>
        </div>

        <div className="lokstallet-footer-section">
          <h3>Kontakt</h3>
          <p>
            Adress:
            <br />
            Drottninggatan 17
            <br />
            541 51 Skövde
            <br />
            E-post: <a href="mailto:info@lokstallet.se">info@lokstallett.se</a>
          </p>
        </div>

        <div className="lokstallet-footer-section">
          <h3>Följ oss</h3>
          <ul className="lokstallet-social-icons">
            <li>
              <a href="https://www.facebook.com/lokstallet.skovde" aria-label="Besök oss på Facebook (öppnas i nytt fönster)" target="_blank" rel="noreferrer">
                <FacebookIcon />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/lokstallet.skovde/" aria-label="Besök oss på Instagram (öppnas i nytt fönster)" target="_blank" rel="noreferrer">
                <InstagramIcon />
              </a>
            </li>
          </ul>
        </div>

      </div>
      <div className="lokstallet-footer-legal">
        <p>&copy; 2025 Lokstallet. Org.nr: <strong>556897-9149</strong></p>
        <div className="lokstallet-footer-links">
          <Link to="/integritetspolicy">Integritetspolicy</Link>
          <Link to="/bra-att-veta">Köpvillkor</Link>
        </div>
      </div>
    </footer>
  );
}
