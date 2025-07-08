import React, { useState } from 'react';
import './KontaktLokstallet.css';

const KontaktLokstallet = () => {
  const [formData, setFormData] = useState({
    namn: '',
    email: '',
    meddelande: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Tack för ditt meddelande!');
    setFormData({ namn: '', email: '', meddelande: '' });
  };

  return (
    <main className="kontakt-wrapper">
      <div className="kontakt-left">
        <h2>Kontakt</h2>
        <p><strong>Telefon:</strong> 0123-456 789</p>
        <p><strong>E-post:</strong> info@lokstallet.se</p>
        <p><strong>Adress:</strong> Stationsgatan 1, 123 45 Stad</p>
      </div>

      <form className="kontakt-form" onSubmit={handleSubmit}>
        <label>
          Namn:
          <input
            type="text"
            name="namn"
            value={formData.namn}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          E-post:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Meddelande:
          <textarea
            name="meddelande"
            value={formData.meddelande}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <button type="submit">Skicka</button>
      </form>

      <div className="kontakt-map">
        <iframe
          title="Lokstallet Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2133.6829511066744!2d11.967017316049778!3d57.708870981113665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464ff36fd24e15d9%3A0x6fa34203cdb2ae4f!2sKungsgatan%2012%2C%20411%2019%20G%C3%B6teborg!5e0!3m2!1ssv!2sse!4v1700000000000!5m2!1ssv!2sse"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </main>
  );
};

export default KontaktLokstallet;
