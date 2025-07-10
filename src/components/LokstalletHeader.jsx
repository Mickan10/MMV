import React from 'react';
import { NavLink } from 'react-router-dom';
import './LokstalletHeader.css';
import logo from '../assets/mmv-front.png'; 

const LokstalletHeader = () => {
  return (
    <header className="lokstallet-header">
      <div className="log-container">
        <NavLink to="/" className="lokstallet-btn">
        <img src={logo} alt="MMV Event logga" style={{ height: '80px' }} />
        </NavLink>
      </div>

      <div className="hero-content">
        <h1>Lokstallet</h1>
        <p>Boka Lokstallet – Skapa oförglömliga minnen i vår unika lokal.</p>
      </div>

      <nav className="hero-nav">
        <ul className="links bottom-nav">
          <li><NavLink to="/lokstallet" className="lokstallet-btn">Home</NavLink></li>
          <li><NavLink to="/boka-lokstallet" className="lokstallet-btn">Boka Lokstallet</NavLink></li>
          <li><NavLink to="/evenemang-lokstallet" className="lokstallet-btn">Evenemang & Biljetter</NavLink></li>
          <li><NavLink to="/lokaler" className="lokstallet-btn">Lokstallets lokaler</NavLink></li>
          <li><NavLink to="/historia" className="lokstallet-btn">Historia</NavLink></li>
          <li><NavLink to="/kontakt-lokstallet" className="lokstallet-btn">Kontakt</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default LokstalletHeader;
