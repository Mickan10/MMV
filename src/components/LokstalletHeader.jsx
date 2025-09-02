import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './LokstalletHeader.css';

const LokstalletHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="lokstallet-header">
      <div className="header-inner">
        {/* Logga */}
        <div className="logo-container">
        </div>

        {/* Hamburger-knapp */}
        <button 
          className={`hamburger ${menuOpen ? 'open' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Meny */}
        <nav className={`hero-nav ${menuOpen ? 'open' : ''}`}>
          <ul className="links">
            <li><NavLink onClick={() => setMenuOpen(false)} to="/lokstallet">Home</NavLink></li>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/boka-lokstallet">Boka Lokstallet</NavLink></li>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/evenemang-lokstallet">Evenemang & Biljetter</NavLink></li>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/lokaler">Lokstallets lokaler</NavLink></li>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/historia">Historia</NavLink></li>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/kontakt-lokstallet">Kontakt</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default LokstalletHeader;
