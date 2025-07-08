import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <div className="header-top">
        <NavLink to="/" className="lokstallet-btn">Lokstallet logo</NavLink>
      </div>

      <div className="logo-container">
        <img src="src/assets/mmvevent.png" alt="MMV Event Logga" className="logo-mmv" />
      </div>

      {/*<h1 className="header-title">MMV Event</h1>*/}

      <nav>
        <ul className="nav-links">
          <li><NavLink to="/mmvevent" end>Hem</NavLink></li>
          <li><NavLink to="/events">Kommande Event</NavLink></li>
          <li><NavLink to="/about">Om oss</NavLink></li>
          <li><NavLink to="/kundcase">Arkiv</NavLink></li>
          <li><NavLink to="/faq">FAQ</NavLink></li>
          <li><NavLink to="/contact">Kontakt</NavLink></li>
        </ul>
      </nav>

      <hr className="header-separator" />
    </header>
  );
}

