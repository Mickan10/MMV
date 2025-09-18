import "./LokstalletFooter.css"; // Skapa separat CSS för Lokstallets footer
import { NavLink } from 'react-router-dom';
import logo from '../assets/lokstalletheader.png';


export default function LokstalletFooter() {
  return (
    <footer className="lokstallet-footer">
      <div className="lokstallet-footer-container">
        <div className="lokstallet-footer-logo-container">
        <img src={logo} alt="Lokstallet Logo" className="lokstallet-logo-fot" />
      </div>

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
            Adress:
            <br />
            Drottninggatan 17
            <br />
            541 51 Skövde
            <br />
            E-post: <a href="mailto:info@lokstallet.se">info@lokstallet.se</a>
          </p>
        </div>

        <div className="lokstallet-footer-section">
          <h3>Följ oss</h3>
          <ul className="lokstallet-social-icons">
            <li>
              <a href="https://www.facebook.com/lokstallet.skovde" title="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/lokstallet.skovde/"
                title="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>

        {/*<div className="lokstallet-form-button-container">
        <h3>Boka Lokstallet</h3>
        <NavLink to="/boka-lokstallet" className="lokstallet-form-button">
          Boka nu!
        </NavLink>
        </div> */}

      </div>
      <p>&copy; 2025 Lokstallet. Musik • Evenemang • Möten</p>
    </footer>
  );
}
