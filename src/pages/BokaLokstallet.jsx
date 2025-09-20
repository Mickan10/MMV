import React, { useState } from "react";
import "./BokaLokstallet.css";

export default function BokaLokstallet() {
  const [local, setLocal] = useState("");
  const [eventType, setEventType] = useState("");
  const [otherEventDescription, setOtherEventDescription] = useState("");
  const [audioTech, setAudioTech] = useState("nej");
  const [lightTech, setLightTech] = useState("nej");
  const [extraPersonnel, setExtraPersonnel] = useState("");
  const [catering, setCatering] = useState("nej");

  const [price, setPrice] = useState(0);
  const [step, setStep] = useState(1); // <-- ny state för att styra steg

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [phone, setPhone] = useState("");

  const [priceError, setPriceError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const showOtherEvent = eventType === "annat";

  // --- spara direkt när namn + epost fylls i ---
  function saveLead() {
    if (name && email) {
      fetch("/sendmail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      }).catch(() => {
        console.warn("Kunde inte spara lead just nu.");
      });
    }
  }

  function nextStep() {
    if (!name || !email) {
      setSubmitError("Vänligen fyll i namn och e-post för att fortsätta.");
      return;
    }
    saveLead();
    setSubmitError("");
    setStep(2);
  }

  function calculatePrice() {
    setPriceError("");
    if (!local) {
      setPriceError("Vänligen välj en lokal innan du beräknar pris.");
      return;
    }

    const localPrices = {
      köket: 1000,
      lillaScenen: 2000,
      storaScenen: 5000,
      konferensrum: 1500,
      helaLokalen: 7000,
      dagskontor: 800,
    };

    let totalPrice = 0;
    if (localPrices[local]) totalPrice += localPrices[local];
    if (audioTech === "ja") totalPrice += 1500;
    if (lightTech === "ja") totalPrice += 1200;

    const extraPersonnelNumber = Number(extraPersonnel);
    const extraPersonnelCount = isNaN(extraPersonnelNumber)
      ? 0
      : extraPersonnelNumber;
    totalPrice += extraPersonnelCount * 500;

    if (catering === "ja") totalPrice += 2000;

    setPrice(totalPrice);
  }

    function handleSubmit() {
    setSubmitError("");
    if (
      !name ||
      !email ||
      !customerType ||
      (customerType === "företag" && !orgNumber) || // endast företag måste ha org.nr
      !phone
    ) {
      setSubmitError("Vänligen fyll i alla obligatoriska fält innan du skickar din förfrågan.");
      return;
    }

    const data = {
      local,
      eventType,
      otherEventDescription,
      audioTech,
      lightTech,
      extraPersonnel,
      catering,
      price,
      name,
      email,
      customerType,
      orgNumber,
      phone,
    };

    fetch("/sendmail.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Förfrågan skickad! Vi hör av oss snart.");
        } else {
          setSubmitError("Något gick fel, försök igen senare.");
        }
      })
      .catch(() => {
        setSubmitError("Nätverksfel, försök igen senare.");
      });
  }


  const summary = (
    <>
      <p><strong>Lokal:</strong> {local || "Ej valt"}</p>
      <p><strong>Evenemangstyp:</strong> {eventType || "Ej valt"}</p>
      <p>
        <strong>Beskrivning av evenemang:</strong>{" "}
        {eventType === "annat" ? otherEventDescription || "Ej valt" : "Ej valt"}
      </p>
      <p><strong>Ljudtekniker:</strong> {audioTech}</p>
      <p><strong>Ljustekniker:</strong> {lightTech}</p>
      <p><strong>Extra personal:</strong> {extraPersonnel || 0}</p>
      <p><strong>Catering:</strong> {catering}</p>
      <p><strong>Totalpris:</strong> {price.toLocaleString()} SEK</p>
    </>
  );

  return (
    <main className="bokamain">
      <div className="forme-container">
        <h1>Boka Lokstallet.</h1>

        {/* Steg 1: Namn + epost */}
        {step === 1 && (
          <section id="step1">
            <h2>Kontaktuppgifter</h2>

            {submitError && <p className="error">{submitError}</p>}

            <label htmlFor="name">Namn:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email">E-post:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={nextStep} disabled={!name || !email}>
              Fortsätt
            </button>
          </section>
        )}

        {/* Steg 2: Bokningsdetaljer */}
        {step === 2 && (
          <>
            <section id="step2">
              <h2>Lokal och tillval – Din fest, dina regler!</h2>

              <label htmlFor="local">Välj lokal:</label>
              <select
                id="local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              >
                <option value="">Välj...</option>
                <option value="köket">Köket</option>
                <option value="lillaScenen">Lilla Scenen</option>
                <option value="storaScenen">Stora Scenen</option>
                <option value="konferensrum">Konferensrum</option>
                <option value="helaLokalen">Hela lokalen</option>
                <option value="dagskontor">Dagskontor</option>
              </select>

              <label htmlFor="eventType">Typ av evenemang:</label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="">Välj...</option>
                <option value="konsert">Konsert</option>
                <option value="teater">Teater</option>
                <option value="föreläsning">Föreläsning</option>
                <option value="konferens">Konferens</option>
                <option value="privat">Privat (bröllop m.m.)</option>
                <option value="workshop">Workshop</option>
                <option value="annat">Annat</option>
              </select>

              {showOtherEvent && (
                <div id="otherEvent">
                  <label htmlFor="otherEventDescription">
                    Beskriv ditt evenemang:
                  </label>
                  <textarea
                    id="otherEventDescription"
                    placeholder="Skriv här..."
                    value={otherEventDescription}
                    onChange={(e) => setOtherEventDescription(e.target.value)}
                  />
                </div>
              )}

              <label htmlFor="audioTech">Ljudtekniker:</label>
              <select
                id="audioTech"
                value={audioTech}
                onChange={(e) => setAudioTech(e.target.value)}
              >
                <option value="nej">Nej</option>
                <option value="ja">Ja</option>
                <option value="egen">Egen</option>
              </select>

              <label htmlFor="lightTech">Ljustekniker:</label>
              <select
                id="lightTech"
                value={lightTech}
                onChange={(e) => setLightTech(e.target.value)}
              >
                <option value="nej">Nej</option>
                <option value="ja">Ja</option>
                <option value="egen">Egen</option>
              </select>

              <label htmlFor="extraPersonnel">Extra personal (antal):</label>
              <input
                type="number"
                id="extraPersonnel"
                min="0"
                value={extraPersonnel}
                onChange={(e) => setExtraPersonnel(e.target.value)}
                placeholder="0"
              />

              <label htmlFor="catering">Catering:</label>
              <select
                id="catering"
                value={catering}
                onChange={(e) => setCatering(e.target.value)}
              >
                <option value="nej">Nej</option>
                <option value="ja">Ja</option>
              </select>

              <button onClick={calculatePrice} disabled={!local}>
                Beräkna pris
              </button>

              {priceError && <p className="error">{priceError}</p>}

              <p id="priceOutput">Totalpris: {price.toLocaleString()} SEK</p>
            </section>

            {/* Kontaktuppgifter steg 2 */}
              <section id="contactForm" style={{ marginTop: "2em" }}>
          <h2>Fyll i mer kontaktinfo</h2>

          {submitError && <p className="error">{submitError}</p>}

          {/* Välj kundtyp */}
          <label htmlFor="customerType">Välj typ:</label>
          <select
            id="customerType"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="">Välj...</option>
            <option value="privatperson">Privatperson</option>
            <option value="företag">Företag</option>
            <option value="arrangör">Arrangör</option>
          </select>

          {/* Visa fält baserat på typ */}
          {customerType === "privatperson" && (
            <>
              <label htmlFor="phone">Telefonnummer:</label>
              <input
                type="tel"
                id="phone"
                placeholder="070-123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          {customerType === "företag" && (
            <>
              <label htmlFor="orgNumber">Organisationsnummer:</label>
              <input
                type="text"
                id="orgNumber"
                placeholder="ÅÅÅÅMMDD-XXXX"
                value={orgNumber}
                onChange={(e) => setOrgNumber(e.target.value)}
              />

              <label htmlFor="phone">Telefonnummer:</label>
              <input
                type="tel"
                id="phone"
                placeholder="070-123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          {customerType === "arrangör" && (
            <>
              <label htmlFor="orgNumber">Organisationsnummer (valfritt):</label>
              <input
                type="text"
                id="orgNumber"
                placeholder="ÅÅÅÅMMDD-XXXX"
                value={orgNumber}
                onChange={(e) => setOrgNumber(e.target.value)}
              />

              <label htmlFor="phone">Telefonnummer:</label>
              <input
                type="tel"
                id="phone"
                placeholder="070-123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}
        </section>

  <section id="summarySection" style={{ marginTop: "1em" }}>
    <h3>Sammanfattning.</h3>
    <div id="summaryContent">{summary}</div>

        <button
          id="submitForm"
          onClick={handleSubmit}
          disabled={
            !name ||
            !email ||
            !customerType ||
            (customerType === "företag" && !orgNumber) || // endast företag måste fylla i
            !phone
          }
            style={{ marginTop: "1.5em" }}
          >
            Skicka förfrågan
        </button>

  </section>


          </>
        )}
      </div>
    </main>
  );
}
