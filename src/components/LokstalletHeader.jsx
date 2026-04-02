import { NavLink } from "react-router-dom";
import { useState } from "react";
import logga from "../assets/headerlok.png";
import "./LokstalletHeader.css";
import menuIcon from "../assets/menuopen.svg";
import closeIcon from "../assets/closed.svg";

const LokstalletHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="lokstallet-header">
      <a href="#main-content" className="skip-link">Hoppa till innehållet</a>
      <div className="header-inner">
        <NavLink to="/lokstallet" onClick={closeMenu} className="logo-link">
        <img src={logga} alt="Lokstallet – startsida" className="header-logo" />
        </NavLink>

        <div className="header-right">
        <button
          className={`ham-icon ${menuOpen ? "is-open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
        >
          <img
            src={menuOpen ? closeIcon : menuIcon}
            alt=""
            className="ham-icon-img"
          />
        </button>


          <ul className="social-icons">
            <li>
              <a
                href="https://www.facebook.com/lokstallet.skovde"
                aria-label="Besök oss på Facebook (öppnas i nytt fönster)"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-facebook" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/lokstallet.skovde/"
                aria-label="Besök oss på Instagram (öppnas i nytt fönster)"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </div>

        <nav className={`hero-nav ${menuOpen ? "open" : ""}`}>
          <ul className="links">
            <li>
              <NavLink
                to="/lokstallet"
                end
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/evenemang-lokstallet"
                end
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Evenemang & Biljetter
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/kontakt-lokstallet"
                end
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Kontakt
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/bra-att-veta"
                end
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Bra att veta
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default LokstalletHeader;
