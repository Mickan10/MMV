import React from "react";
import "./Footer.css"; // Skapa CSS enligt din footerstil

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <img src="src/assets/mmv-front.png" alt="MMV Event Logo" className="logo-mmv-fot" />

        <div className="footer-section">
          <h3>Om MMV Event</h3>
          <p>MMV Event och Konsertproduktion arrangerar konserter och evenemang av hög kvalitet. Vi erbjuder en mångfald av musikgenrer och skapar minnesvärda upplevelser för både artister och publik. Med passion och engagemang främjar vi musiklivet i både städer och på landsbygden.</p>
        </div>

        <div className="footer-section">
          <h3>Kontakt</h3>
          <p>
            MMV Event<br />
            Eventgatan 42<br />
            541 30 Skövde<br />
            Tel: <a href="tel:+46701234567">070-123 45 67</a><br />
            E-post: <a href="mailto:info@mmvevent.se">info@mmvevent.se</a>
          </p>
        </div>

        <div className="footer-section">
          <h3>Följ oss</h3>
          <ul className="social-icons">
            <li><a href="https://www.facebook.com/mmvevent" title="Facebook"><i className="fab fa-facebook"></i></a></li>
            <li><a href="https://www.instagram.com/mmvevent/" title="Instagram"><i className="fab fa-instagram"></i></a></li> 
          </ul>
        </div>

        <div className="form-button-container">
          <h3>Band och Arrangörer:</h3>
          <a href="/form" className="form-button">Häng hos oss!</a>
        </div>
      </div>
      <p>&copy; 2024 MMV Event. Alla rättigheter förbehålls.</p>
    </footer>
  );
}
