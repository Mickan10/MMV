import "./LokstalletFooter.css"; // Skapa separat CSS för Lokstallets footer
import { NavLink } from 'react-router-dom';


export default function LokstalletFooter() {
  return (
    <footer className="lokstallet-footer">
      <div className="lokstallet-footer-container">
        <img
          src="/Bilder/lokstallet-logo.png"
          alt="Lokstallet Logo"
          className="lokstallet-logo-fot"
        />

        <div className="lokstallet-footer-section">
          <h3>Om Lokstallet</h3>
          <p>
            Lokstallet är en unik lokal för evenemang, fester och
            minnesvärda stunder. Vi erbjuder en personlig och flexibel miljö
            som passar både små och stora sällskap. Välkommen att boka och
            skapa oförglömliga minnen hos oss.
          </p>
        </div>

        <div className="lokstallet-footer-section">
          <h3>Kontakt</h3>
          <p>
            Lokstallet
            <br />
            Storgatan 12
            <br />
            541 30 Skövde
            <br />
            Tel: <a href="tel:+46701234568">070-123 45 68</a>
            <br />
            E-post: <a href="mailto:info@lokstallet.se">info@lokstallet.se</a>
          </p>
        </div>

        <div className="lokstallet-footer-section">
          <h3>Följ oss</h3>
          <ul className="lokstallet-social-icons">
            <li>
              <a href="https://www.facebook.com/lokstallet" title="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/lokstallet/"
                title="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>

        <div className="lokstallet-form-button-container">
        <h3>Boka Lokstallet</h3>
        <NavLink to="/boka-lokstallet" className="lokstallet-form-button">
          Boka nu!
        </NavLink>
      </div>
      </div>
      <p>&copy; 2024 Lokstallet. Alla rättigheter förbehålls.</p>
    </footer>
  );
}
