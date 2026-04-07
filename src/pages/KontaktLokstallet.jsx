import { useState } from 'react';
import './KontaktLokstallet.css';

const KontaktLokstallet = () => {
  const [formData, setFormData] = useState({
    namn: '',
    email: '',
    meddelande: '',
  });

  const [status, setStatus] = useState(null);
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
      const response = await fetch('https://www.lokstallett.se/kontakt.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || `Serverfel: ${response.status}`);
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
    <div className="kontakt-page">
      <div className="kontakt-hero">
        <h1>Kontakt</h1>
        <p>Välkommen att höra av dig för bokning eller frågor.</p>
      </div>

      <div className="kontakt-content">
        {/* INFO */}
        <div className="kontakt-info">
          <h2>Hitta oss</h2>
          <div className="kontakt-info-item">
            <p className="kontakt-info-label">E-post</p>
            <p className="kontakt-info-value">
              <a href="mailto:info@lokstallett.se">info@lokstallett.se</a>
            </p>
          </div>
          <div className="kontakt-info-item">
            <p className="kontakt-info-label">Adress</p>
            <p className="kontakt-info-value">Drottninggatan 17<br />541 51 Skövde</p>
          </div>
          <div className="kontakt-info-item">
            <p className="kontakt-info-label">Sociala medier</p>
            <div className="kontakt-social-icons">
              <a href="https://www.facebook.com/lokstallet.skovde" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook" aria-hidden="true"></i>
              </a>
              <a href="https://www.instagram.com/lokstallet.skovde/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>

        {/* FORMULÄR */}
        <div className="kontakt-form-wrap">
          <h2>Skicka meddelande</h2>
          <form className="kontakt-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="kontakt-namn">Namn</label>
              <input id="kontakt-namn" type="text" name="namn" value={formData.namn} onChange={handleChange} required disabled={status === 'sending'} autoComplete="name" placeholder="Ditt namn" />
            </div>
            <div>
              <label htmlFor="kontakt-email">E-post</label>
              <input id="kontakt-email" type="email" name="email" value={formData.email} onChange={handleChange} required disabled={status === 'sending'} autoComplete="email" placeholder="din@epost.se" />
            </div>
            <div>
              <label htmlFor="kontakt-meddelande">Meddelande</label>
              <textarea id="kontakt-meddelande" name="meddelande" value={formData.meddelande} onChange={handleChange} required disabled={status === 'sending'} placeholder="Skriv ditt meddelande här…" />
            </div>

            {status === 'success' && <p className="success-message" role="status" aria-live="polite">Tack! Vi återkommer så snart vi kan.</p>}
            {status === 'error' && <p className="error-message" role="alert" aria-live="assertive">Fel: {errorMessage}</p>}

            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Skickar…' : 'Skicka meddelande'}
            </button>
          </form>
        </div>

        {/* KARTA */}
        <div className="kontakt-map">
          <iframe
            title="Lokstallet Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2091.534942555187!2d13.844044776589282!3d58.384379586298536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465b023be5523c4b%3A0xa5aa6a0dc67c2214!2sDrottninggatan%2017%2C%20541%2051%20Sk%C3%B6vde!5e0!3m2!1ssv!2sse!4v1754592253140!5m2!1ssv!2sse"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default KontaktLokstallet;
