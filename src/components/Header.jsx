import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <NavLink to="/" className="lokstallet-btn">Lokstallet logo</NavLink>

      <div className="logo-container">
        <NavLink to="/">
          <img src="/Bilder/logo.png" alt="MMV Event Logo" className="logo-mmv" />
          <img src="/Bilder/2.jpg" alt="Bakgrundsbild 1" className="bild-header2" />
          <img src="/Bilder/3.jpg" alt="Bakgrundsbild 2" className="bild-logo2" />
        </NavLink>
      </div>

      <h1 className="header-title">MMV Event</h1>

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

      <hr className="header-separator" style={{border: "1px solid #000"}} />
    </header>
  );
}
