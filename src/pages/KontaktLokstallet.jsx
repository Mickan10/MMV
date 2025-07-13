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
        <p><strong>Adress:</strong> Drottninggatan 17, 541 51 Skövde</p>
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
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1635.1511027116955!2d13.852596621792623!3d58.38304160479618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f6e69d107b2d3%3A0x91a98328b5d69e88!2sLokstallet%20Drottninggatan%2017%2C%20541%2051%20Sk%C3%B6vde!5e0!3m2!1ssv!2sse!4v1700000000000!5m2!1ssv!2sse"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      style={{ width: "100%", height: "100%", border: 0 }}
    ></iframe>
      </div>
    </main>
  );
};

export default KontaktLokstallet;
