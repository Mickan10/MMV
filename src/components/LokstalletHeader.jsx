import { NavLink } from "react-router-dom";
import { useState } from "react";
import logga from "../assets/headerlok.png";
import "./LokstalletHeader.css";
import menuIcon from "../assets/menuopen.png";
import closeIcon from "../assets/closed.png";

const LokstalletHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="lokstallet-header">
      <div className="header-inner">
        {/* Logga (visas på mobil/tablet, döljs på desktop via CSS) */}
        <img src={logga} alt="Lokstallet logo" className="header-logo" />

        <div className="header-right">
          {/* Hamburgarikonen (mobil/tablet) */}
          <button
            className="ham-icon"
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

          {/* Sociala medier (mobil/tablet) */}
          <ul className="social-icons">
            <li>
              <a
                href="https://www.facebook.com/lokstallet.skovde"
                title="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/lokstallet.skovde/"
                title="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>

        {/* Menyn */}
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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default LokstalletHeader;
