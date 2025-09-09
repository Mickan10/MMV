import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import logga from "../assets/headerlok.png";
import './LokstalletHeader.css';
import menuIcon from '../assets/line_weight_24dp_FFFFFF_FILL0_wght500_GRAD0_opsz24.png'; 
import closeIcon from '../assets/cancel_24dp_FFFFFF_FILL0_wght500_GRAD0_opsz24.png'; 

const LokstalletHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="lokstallet-header">
      <div className="header-inner">
        <img src={logga} alt="Lokstallet logo" className="header-logo" />

          <button
        className="ham-icon"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <img
          src={menuOpen ? closeIcon : menuIcon}  // här byter du ikon
          alt={menuOpen ? "Close menu" : "Open menu"}
          className="ham-icon-img"
        />
      </button>



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
