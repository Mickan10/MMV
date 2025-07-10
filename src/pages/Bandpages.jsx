import React, { useState } from "react";
import "./Bandpages.css";

export default function Bandpages() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bandName: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Här kan du lägga till kod för att skicka datan till en server eller backend
    console.log("Form data:", formData);

    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      bandName: "",
      message: "",
    });
  };

  return (
    <div className="band-form-container">
      <h1>Förfrågan för band & arrangörer</h1>
      <p className="subtext">
        Är du ett band, artist eller arrangör som vill spela eller boka Lokstallet? Fyll i formuläret nedan!
      </p>

      {submitted && <p className="success-message">Tack för din förfrågan! Vi återkommer så snart vi kan.</p>}

      <form onSubmit={handleSubmit} className="band-form">
        <label>
          Namn
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          E-post
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Bandnamn / Företag
          <input
            type="text"
            name="bandName"
            value={formData.bandName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Meddelande
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Skicka förfrågan</button>
      </form>
    </div>
  );
}
