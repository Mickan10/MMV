import React, { useState } from "react";
import "./BokaLokstallet.css";

export default function BokaLokstallet() {
  // States för formulärvärden
  const [local, setLocal] = useState("");
  const [eventType, setEventType] = useState("");
  const [otherEventDescription, setOtherEventDescription] = useState("");
  const [audioTech, setAudioTech] = useState("nej");
  const [lightTech, setLightTech] = useState("nej");
  const [extraPersonnel, setExtraPersonnel] = useState("");
  const [ticketSales, setTicketSales] = useState("nej");
  const [catering, setCatering] = useState("nej");

  const [price, setPrice] = useState(0);
  const [step, setStep] = useState(1);

  const [bookingDate, setBookingDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [contactRequest, setContactRequest] = useState("nej");

  // Visa fritextruta endast om eventType är 'annat'
  const showOtherEvent = eventType === "annat";

  // Beräkna pris
  function calculatePrice() {
    if (!local) {
      alert("Vänligen välj en lokal innan du går vidare.");
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
    const extraPersonnelCount = isNaN(extraPersonnelNumber) ? 0 : extraPersonnelNumber;
    totalPrice += extraPersonnelCount * 500;

    if (catering === "ja") totalPrice += 2000;
    if (ticketSales === "ja") totalPrice += 1000;

    setPrice(totalPrice);
  }

  // Sammanfattningstext
  const summary = (
    <>
      <p>
        <strong>Lokal:</strong> {local || "Ej valt"}
      </p>
      <p>
        <strong>Evenemangstyp:</strong> {eventType || "Ej valt"}
      </p>
      <p>
        <strong>Beskrivning av evenemang:</strong>{" "}
        {eventType === "annat" ? otherEventDescription || "Ej valt" : "Ej valt"}
      </p>
      <p>
        <strong>Ljudtekniker:</strong> {audioTech}
      </p>
      <p>
        <strong>Ljustekniker:</strong> {lightTech}
      </p>
      <p>
        <strong>Extra personal:</strong> {extraPersonnel || 0}
      </p>
      <p>
        <strong>Biljettförsäljning:</strong> {ticketSales}
      </p>
      <p>
        <strong>Catering:</strong> {catering}
      </p>
      <p>
        <strong>Datum:</strong> {bookingDate || "Ej valt"}
      </p>
      <p>
        <strong>Totalpris:</strong> {price.toLocaleString()} SEK
      </p>
    </>
  );

  // Validera och gå vidare till steg 3
  function handleGoToStep3() {
    if (!bookingDate) {
      alert("Vänligen välj ett datum innan du går vidare.");
      return;
    }
    setStep(3);
  }

  // Validera och skicka formulär
  function handleSubmit() {
    if (!name || !email || !customerType || !orgNumber || !phone) {
      alert("Vänligen fyll i alla fält innan du skickar din förfrågan.");
      return;
    }
    alert("Tack för din förfrågan! Vi återkommer snart.");
    // Här kan du också lägga till API-anrop eller annan logik för att spara/skicka data
  }

  return (
    <main className="bokamain">
      <div className="forme-container">
        <h1>Boka Lokal</h1>

        {/* Steg 1 */}
        {step === 1 && (
          <section id="step1">
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

            <label htmlFor="ticketSales">Biljettförsäljning:</label>
            <select
              id="ticketSales"
              value={ticketSales}
              onChange={(e) => setTicketSales(e.target.value)}
            >
              <option value="nej">Nej</option>
              <option value="ja">Ja</option>
            </select>

            <label htmlFor="catering">Catering:</label>
            <select
              id="catering"
              value={catering}
              onChange={(e) => setCatering(e.target.value)}
            >
              <option value="nej">Nej</option>
              <option value="ja">Ja</option>
            </select>

            <button onClick={calculatePrice}>Beräkna pris</button>
            <p id="priceOutput">Totalpris: {price.toLocaleString()} SEK</p>
            {price > 0 && (
              <button onClick={() => setStep(2)} id="goToStep2">
                Gå vidare
              </button>
            )}
          </section>
        )}

        {/* Steg 2 */}
        {step === 2 && (
          <section id="step2">
            <h2>Välj datum</h2>
            <input
              type="date"
              id="bookingDate"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
            <button onClick={handleGoToStep3} id="goToStep3">
              Nästa
            </button>

            {/* Sammanfattning */}
            <section id="summarySection" style={{ marginTop: "1em" }}>
              <h3>Sammanfattning av din bokning</h3>
              <div id="summaryContent">{summary}</div>
            </section>
          </section>
        )}

        {/* Steg 3 */}
        {step === 3 && (
          <section id="step3">
            <h2>Kontaktuppgifter</h2>

            <label htmlFor="name">Namn:</label>
            <input
              type="text"
              id="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email">E-post:</label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="customerType">Välj typ:</label>
            <select
              id="customerType"
              value={customerType}
              required
              onChange={(e) => setCustomerType(e.target.value)}
            >
              <option value="">Välj...</option>
              <option value="privatperson">Privatperson</option>
              <option value="företag">Företag</option>
              <option value="arrangör">Arrangör</option>
            </select>

            <label htmlFor="orgNumber">Organisationsnummer:</label>
            <input
              type="text"
              id="orgNumber"
              placeholder="ÅÅÅÅMMDD-XXXX"
              required
              value={orgNumber}
              onChange={(e) => setOrgNumber(e.target.value)}
            />

            <label htmlFor="phone">Telefonnummer:</label>
            <input
              type="tel"
              id="phone"
              placeholder="070-123 45 67"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label htmlFor="contactRequest">
              Vill du att ansvarig på Lokstallet kontaktar dig?
            </label>
            <select
              id="contactRequest"
              value={contactRequest}
              onChange={(e) => setContactRequest(e.target.value)}
            >
              <option value="nej">Nej</option>
              <option value="ja">Ja</option>
            </select>

            <button id="submitForm" onClick={handleSubmit}>
              Skicka förfrågan
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
