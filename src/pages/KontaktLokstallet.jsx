import React, { useState } from 'react';
import './KontaktLokstallet.css';

const KontaktLokstallet = () => {
  const [formData, setFormData] = useState({
    namn: '',
    email: '',
    meddelande: '',
  });

  const [status, setStatus] = useState(null); // null, 'sending', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/kontakt.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Serverfel: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({ namn: '', email: '', meddelande: '' });
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Något gick fel');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Något gick fel, försök igen senare');
    }
  };

  return (
    <main className="kontakt-wrapper">
      <div className="kontakt-left">
        <h2>Kontakt</h2>
        {/*<p><strong>Telefon:</strong> 0123-456 789</p>*/}
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
            disabled={status === 'sending'}
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
            disabled={status === 'sending'}
          />
        </label>
        <label>
          Meddelande:
          <textarea
            name="meddelande"
            value={formData.meddelande}
            onChange={handleChange}
            required
            disabled={status === 'sending'}
          ></textarea>
        </label>

        {/*Här visas meddelandena INNAN knappen */}
        {status === 'success' && (
          <p className="success-message">Tack för ditt meddelande!</p>
        )}
        {status === 'error' && (
          <p className="error-message">Fel: {errorMessage}</p>
        )}

        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Skickar...' : 'Skicka'}
        </button>
      </form>

      <div className="kontakt-map">
        <iframe
          title="Lokstallet Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2091.534942555187!2d13.844044776589282!3d58.384379586298536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465b023be5523c4b%3A0xa5aa6a0dc67c2214!2sDrottninggatan%2017%2C%20541%2051%20Sk%C3%B6vde!5e0!3m2!1ssv!2sse!4v1754592253140!5m2!1ssv!2sse"
          width="100%"
          height="600"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  );
};

export default KontaktLokstallet;
