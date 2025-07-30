import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './LokstalletHeader.css';
import logo from '../assets/mmv-front.png'; 
import logga from '../assets/lokstalletheader.png';

const LokstalletHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="lokstallet-header">
      <div className="log-container">
        <NavLink to="/" className="lokstalle-btn">
          <img src={logo} alt="MMV Event logga" style={{ height: '50px' }} />
        </NavLink>
      </div>

      <div className="hero-content">
        <img src={logga} alt="Lokstallet logga" style={{ height: '380px' }} />
        {/*<p>Boka Lokstallet – Skapa oförglömliga minnen i vår unika lokal.</p>*/}
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

      {/* Menyn */}
      <nav className={`hero-nav ${menuOpen ? 'open' : ''}`}>
        <ul className="links bottom-nav">
          <li><NavLink onClick={() => setMenuOpen(false)} to="/lokstallet" className="lokstallet-btn">Home</NavLink></li>
          <li><NavLink onClick={() => setMenuOpen(false)} to="/boka-lokstallet" className="lokstallet-btn">Boka Lokstallet</NavLink></li>
          <li><NavLink onClick={() => setMenuOpen(false)} to="/evenemang-lokstallet" className="lokstallet-btn">Evenemang & Biljetter</NavLink></li>
          <li><NavLink onClick={() => setMenuOpen(false)} to="/lokaler" className="lokstallet-btn">Lokstallets lokaler</NavLink></li>
          <li><NavLink onClick={() => setMenuOpen(false)} to="/historia" className="lokstallet-btn">Historia</NavLink></li>
          <li><NavLink onClick={() => setMenuOpen(false)} to="/kontakt-lokstallet" className="lokstallet-btn">Kontakt</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default LokstalletHeader;
