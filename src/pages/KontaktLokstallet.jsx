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
    // Här kan du skicka formuläret till en server eller e-posttjänst
    alert('Tack för ditt meddelande!');
    setFormData({ namn: '', email: '', meddelande: '' });
  };

  return (
    <main className="kontakt-container">
      <h1>Kontakta oss</h1>
      <div className="kontakt-content">
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

        <div className="kontakt-info">
          <h2>Lokstallet</h2>
          <p>Adress: Stationsgatan 1, 123 45 Stad</p>
          <p>E-post: info@lokstallet.se</p>
          <p>Telefon: 0123-456 789</p>
        </div>
      </div>
    </main>
  );
};

export default KontaktLokstallet;
