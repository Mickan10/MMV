import React from 'react';
import { NavLink } from 'react-router-dom';

const LokstalletHeader = () => {
  return (
    <header className="hero">
      <div className="logo-container">
        <NavLink to="/" className="btn">
          <img src="Bilder/mmvevent.png" alt="MMV Event logga" style={{ height: '80px' }} />
        </NavLink>
      </div>

      <div className="hero-content">
        <h1>Lokstallet</h1>
        <p>Boka Lokstallet – Skapa oförglömliga minnen i vår unika lokal.</p>
      </div>

      <nav className="hero-nav">
        <ul className="nav-links bottom-nav">
          <li><NavLink to="/lokstallet" className="btn">Home</NavLink></li>
          <li><NavLink to="/boka-lokstallet" className="btn">Boka Lokstallet</NavLink></li>
          <li><NavLink to="/evenemang-lokstallet" className="btn">Evenemang & Biljetter</NavLink></li>
          <li><NavLink to="/lokaler" className="btn">Lokstallets lokaler</NavLink></li>
          <li><NavLink to="/historia" className="btn">Historia</NavLink></li>
          <li><NavLink to="/kontakt-lokstallet" className="btn">Kontakt</NavLink></li>
        </ul>
      </nav>

    </header>
  );
};

export default LokstalletHeader;
