import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import logga from "../assets/headerlok.png";
import './LokstalletHeader.css';
import menuIcon from '../assets/menuopen.png'; 
import closeIcon from '../assets/closed.png'; 

const LokstalletHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="lokstallet-header">
      <div className="header-inner">
        {/* Logga till vänster */}
        <img src={logga} alt="Lokstallet logo" className="header-logo" />

        <div className="header-right">
          {/* Hamburgarikonen */}
          <button
            className="ham-icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <img
              src={menuOpen ? closeIcon : menuIcon}
              alt={menuOpen ? "Close menu" : "Open menu"}
              className="ham-icon-img"
            />
          </button>

          {/* Sociala medier (bara på småskärmar) */}
          <ul className="social-icons">
            <li>
              <a href="https://www.facebook.com/lokstallet.skovde" title="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/lokstallet.skovde/" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>

        {/* Menyn */}
        <nav className={`hero-nav ${menuOpen ? 'open' : ''}`}>
        <ul className="links">
  <li>
    <NavLink end onClick={() => setMenuOpen(false)} to="/lokstallet">
      Home
    </NavLink>
  </li>
  <li>
    <NavLink end onClick={() => setMenuOpen(false)} to="/boka-lokstallet">
      Boka Lokstallet
    </NavLink>
  </li>
  <li>
    <NavLink end onClick={() => setMenuOpen(false)} to="/evenemang-lokstallet">
      Evenemang & Biljetter
    </NavLink>
  </li>
  <li>
    <NavLink end onClick={() => setMenuOpen(false)} to="/lokaler">
      Lokstallets lokaler
    </NavLink>
  </li>
  <li>
    <NavLink end onClick={() => setMenuOpen(false)} to="/historia">
      Historia
    </NavLink>
  </li>
  <li>
    <NavLink end onClick={() => setMenuOpen(false)} to="/kontakt-lokstallet">
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
