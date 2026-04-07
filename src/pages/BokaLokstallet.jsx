import { useState, useEffect, useMemo } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./BokaLokstallet.css";

const MONTH_NAMES = [
  "Januari","Februari","Mars","April","Maj","Juni",
  "Juli","Augusti","September","Oktober","November","December",
];
const DAY_NAMES = ["Mån","Tis","Ons","Tor","Fre","Lör","Sön"];

const LOCAL_LABELS = {
  helaLokalen: "Hela lokalen",
  köket: "Köket",
  lillaScenen: "Lilla Scenen",
  storaScenen: "Stora Scenen",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d} ${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

function BookingCalendar({ bookedDates, selectedDate, onSelectDate, loading }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  const toDateStr = (d) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isPast = (d) => {
    const date = new Date(viewYear, viewMonth, d);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const isBooked = (d) => bookedDates.has(toDateStr(d));
  const isSelected = (d) => toDateStr(d) === selectedDate;
  const isToday = (d) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleClick = (d) => {
    if (!d || isPast(d) || isBooked(d)) return;
    onSelectDate(toDateStr(d));
  };

  return (
    <div className="boka-calendar">
      <div className="boka-cal-header">
        <button
          type="button"
          className="boka-cal-nav"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Föregående månad"
        >
          ‹
        </button>
        <span className="boka-cal-title">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="boka-cal-nav"
          onClick={nextMonth}
          aria-label="Nästa månad"
        >
          ›
        </button>
      </div>

      {loading ? (
        <p className="boka-cal-loading">Laddar tillgänglighet…</p>
      ) : (
        <div className="boka-cal-grid">
          {DAY_NAMES.map((d) => (
            <div key={d} className="boka-cal-dayname">{d}</div>
          ))}
          {days.map((d, i) => {
            const past = d && isPast(d);
            const booked = d && isBooked(d);
            const selected = d && isSelected(d);
            const available = d && !past && !booked;
            const todayCell = d && isToday(d);

            return (
              <div
                key={i}
                className={[
                  "boka-cal-day",
                  !d ? "boka-cal-empty" : "",
                  past ? "boka-cal-past" : "",
                  booked ? "boka-cal-booked" : "",
                  selected ? "boka-cal-selected" : "",
                  available && !selected ? "boka-cal-available" : "",
                  todayCell ? "boka-cal-today" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleClick(d)}
                role={available ? "button" : undefined}
                tabIndex={available ? 0 : undefined}
                onKeyDown={(e) => e.key === "Enter" && handleClick(d)}
                aria-label={
                  d
                    ? `${d} ${MONTH_NAMES[viewMonth]}${booked ? " – bokad" : past ? " – passerat" : ""}`
                    : undefined
                }
                aria-disabled={d && (past || booked) ? "true" : undefined}
                aria-pressed={selected ? "true" : undefined}
              >
                {d || ""}
              </div>
            );
          })}
        </div>
      )}

      <div className="boka-cal-legend">
        <span className="boka-cal-leg-item">
          <span className="boka-cal-leg-dot leg-available" />
          Ledig
        </span>
        <span className="boka-cal-leg-item">
          <span className="boka-cal-leg-dot leg-booked" />
          Bokad
        </span>
        <span className="boka-cal-leg-item">
          <span className="boka-cal-leg-dot leg-selected" />
          Vald
        </span>
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  local: "",
  inkluderaKok: true,
  inkluderaLillaScen: true,
  inkluderaStoraScen: true,
  antalPersoner: "",
  mobling: "",
  eventType: "",
  otherEventDescription: "",
  audioTech: "nej",
  lightTech: "nej",
  extraPersonnel: "",
  catering: "nej",
  name: "",
  email: "",
  customerType: "",
  orgNumber: "",
  phone: "",
};

const LOCAL_PRICES = {
  helaLokalen: 7000,
  köket: 1000,
  lillaScenen: 2000,
  storaScenen: 5000,
};

export default function BokaLokstallet() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedDates, setBookedDates] = useState(new Set());
  const [loadingDates, setLoadingDates] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Fetch booked dates från både bokningar och events
  useEffect(() => {
    if (!form.local) {
      setBookedDates(new Set());
      setSelectedDate("");
      return;
    }
    let cancelled = false;
    const fetch_ = async () => {
      setLoadingDates(true);
      try {
        const [bookingsSnap, eventsSnap] = await Promise.all([
          getDocs(collection(db, "bookings")),
          getDocs(collection(db, "events")),
        ]);

        const booked = new Set();

        // Bokningsförfrågningar – blockera per lokal
        bookingsSnap.docs.forEach((doc) => {
          const b = doc.data();
          if (
            b.local === form.local ||
            b.local === "helaLokalen" ||
            form.local === "helaLokalen"
          ) {
            booked.add(b.date);
          }
        });

        // Events – blockera alla datum (hela stället är upptaget vid event)
        eventsSnap.docs.forEach((doc) => {
          const e = doc.data();
          if (e.hidden === true) return;
          if (!e.date) return;
          // Datum sparas som sträng "YYYY-MM-DD" från adminpanelen
          let dateStr = typeof e.date === "string" ? e.date : null;
          if (!dateStr && e.date?.toDate) {
            const d = e.date.toDate();
            dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
          }
          if (dateStr) booked.add(dateStr);
        });

        if (!cancelled) setBookedDates(booked);
      } catch (err) {
        console.error("Fetch booked dates error:", err);
      } finally {
        if (!cancelled) setLoadingDates(false);
      }
    };
    fetch_();
    setSelectedDate("");
    return () => { cancelled = true; };
  }, [form.local]);

  function nextStep() {
    if (!form.name || !form.email) {
      setSubmitError("Vänligen fyll i namn och e-post för att fortsätta.");
      return;
    }
    setSubmitError("");
    setStep(2);
  }

  function calculatePrice() {
    setPriceError("");
    if (!form.local) {
      setPriceError("Välj ett alternativ innan du beräknar pris.");
      return;
    }
    let total = LOCAL_PRICES[form.local] || 0;
    if (form.audioTech === "ja") total += 1500;
    if (form.lightTech === "ja") total += 1200;
    total += (parseInt(form.extraPersonnel, 10) || 0) * 500;
    if (form.catering === "ja") total += 2000;
    setPrice(total);

    // Skicka lead-mejl till Lokstallet (icke-blockerande)
    fetch("/sendmail.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "lead",
        name: form.name,
        email: form.email,
        local: LOCAL_LABELS[form.local],
        antalPersoner: form.antalPersoner,
        mobling: form.mobling,
        eventType: form.eventType,
        audioTech: form.audioTech,
        lightTech: form.lightTech,
        extraPersonnel: form.extraPersonnel,
        catering: form.catering,
        estimatedPrice: total,
      }),
    }).catch(() => {});
  }

  async function handleSubmit() {
    setSubmitError("");
    if (
      !form.name ||
      !form.email ||
      !form.customerType ||
      (form.customerType === "företag" && !form.orgNumber) ||
      !form.phone ||
      !form.local ||
      !selectedDate
    ) {
      setSubmitError("Vänligen fyll i alla obligatoriska fält (inkl. lokal och datum).");
      return;
    }

    try {
      // Race-condition guard: re-check availability just before saving
      const snapshot = await getDocs(collection(db, "bookings"));
      let conflict = false;
      snapshot.docs.forEach((doc) => {
        const b = doc.data();
        if (
          b.date === selectedDate &&
          (b.local === form.local || b.local === "helaLokalen" || form.local === "helaLokalen")
        ) {
          conflict = true;
        }
      });

      if (conflict) {
        setSubmitError(
          "Tyvärr bokades detta datum precis av någon annan. Välj ett annat datum."
        );
        // Refresh the calendar
        const booked = new Set();
        snapshot.docs.forEach((doc) => {
          const b = doc.data();
          if (
            b.local === form.local ||
            b.local === "helaLokalen" ||
            form.local === "helaLokalen"
          ) {
            booked.add(b.date);
          }
        });
        setBookedDates(booked);
        setSelectedDate("");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        date: selectedDate,
        local: form.local,
        antalPersoner: parseInt(form.antalPersoner, 10) || 0,
        mobling: form.mobling,
        utrymmen: form.local === "helaLokalen" ? [form.inkluderaKok && "Köket", form.inkluderaLillaScen && "Lilla scenen", form.inkluderaStoraScen && "Stora scenen"].filter(Boolean) : [LOCAL_LABELS[form.local]],
        eventType: form.eventType,
        otherEventDescription: form.otherEventDescription,
        audioTech: form.audioTech,
        lightTech: form.lightTech,
        extraPersonnel: parseInt(form.extraPersonnel, 10) || 0,
        catering: form.catering,
        price,
        name: form.name,
        email: form.email,
        customerType: form.customerType,
        orgNumber: form.orgNumber,
        phone: form.phone,
        status: "prelbooked",
        createdAt: new Date().toISOString(),
      });

      // Also attempt email notification (non-blocking)
      fetch("/sendmail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          date: selectedDate,
          local: LOCAL_LABELS[form.local],
          eventType: form.eventType,
          phone: form.phone,
          price,
        }),
      }).catch(() => {});

      setBookingSuccess(true);
    } catch (err) {
      console.error("Submit booking error:", err);
      setSubmitError("Något gick fel, försök igen senare.");
    }
  }

  if (bookingSuccess) {
    return (
      <main className="bokamain">
        <div className="forme-container">
          <div className="boka-success">
            <div className="boka-success-icon">✓</div>
            <h1>Tack, {form.name}!</h1>
            <p>
              Din bokningsförfrågan för <strong>{LOCAL_LABELS[form.local]}</strong> den{" "}
              <strong>{formatDate(selectedDate)}</strong> har tagits emot.
            </p>
            <p>Vi hör av oss snart till <strong>{form.email}</strong> för att bekräfta bokningen.</p>
          </div>
        </div>
      </main>
    );
  }

  const summary = (
    <div className="boka-summary-grid">
      <span className="boka-sum-label">Lokal</span>
      <span>{LOCAL_LABELS[form.local] || "–"}</span>
      <span className="boka-sum-label">Datum</span>
      <span>{selectedDate ? formatDate(selectedDate) : "–"}</span>
      <span className="boka-sum-label">Antal personer</span>
      <span>{form.antalPersoner || "–"}</span>
      <span className="boka-sum-label">Möblering</span>
      <span>{form.mobling || "–"}</span>
      {form.local === "helaLokalen" && (
        <>
          <span className="boka-sum-label">Utrymmen</span>
          <span>
            {[form.inkluderaKok && "Köket", form.inkluderaLillaScen && "Lilla scenen", form.inkluderaStoraScen && "Stora scenen"].filter(Boolean).join(", ") || "Inga valda"}
          </span>
        </>
      )}
      <span className="boka-sum-label">Evenemangstyp</span>
      <span>{form.eventType || "–"}</span>
      {form.eventType === "annat" && (
        <>
          <span className="boka-sum-label">Beskrivning</span>
          <span>{form.otherEventDescription || "–"}</span>
        </>
      )}
      <span className="boka-sum-label">Ljudtekniker</span>
      <span>{form.audioTech}</span>
      <span className="boka-sum-label">Ljustekniker</span>
      <span>{form.lightTech}</span>
      <span className="boka-sum-label">Extra personal</span>
      <span>{form.extraPersonnel || 0} st</span>
      <span className="boka-sum-label">Catering</span>
      <span>{form.catering}</span>
      <span className="boka-sum-label boka-sum-price">Totalpris</span>
      <span className="boka-sum-price">{price.toLocaleString("sv-SE")} SEK</span>
    </div>
  );

  return (
    <main className="bokamain">
      <div className="forme-container">
        <h1>Boka Lokstallet</h1>
        <p className="boka-step-indicator" aria-live="polite">
          Steg {step} av 2
        </p>

        {/* ── STEP 1: Contact ── */}
        {step === 1 && (
          <section className="boka-section" id="step1">
            <h2>Kontaktuppgifter</h2>
            {submitError && (
              <p className="error" role="alert">{submitError}</p>
            )}
            <div className="boka-field">
              <label htmlFor="name">Namn *</label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Förnamn Efternamn"
              />
            </div>
            <div className="boka-field">
              <label htmlFor="email">E-post *</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={set("email")}
                placeholder="din@epost.se"
              />
            </div>
            <button onClick={nextStep} disabled={!form.name || !form.email}>
              Fortsätt
            </button>
          </section>
        )}

        {/* ── STEP 2: Booking details ── */}
        {step === 2 && (
          <>
            {/* Lokal + kalender */}
            <section className="boka-section" id="step2-lokal">
              <h2>Välj lokal & datum</h2>

              <div className="boka-field">
                <label htmlFor="local">Vad vill du boka? *</label>
                <select id="local" value={form.local} onChange={(e) => setForm((f) => ({ ...f, local: e.target.value, inkluderaKok: true, inkluderaLillaScen: true, inkluderaStoraScen: true }))}>
                  <option value="">Välj…</option>
                  <option value="helaLokalen">Hela lokalen</option>
                  <option value="köket">Endast köket</option>
                  <option value="lillaScenen">Endast lilla scenen</option>
                  <option value="storaScenen">Endast stora scenen</option>
                </select>
              </div>

              {form.local === "helaLokalen" && (
                <div className="boka-field">
                  <label>Vad vill du använda? (avmarkera det du inte behöver)</label>
                  <div className="boka-checkbox-group">
                    <label className="boka-checkbox-label">
                      <input type="checkbox" checked={form.inkluderaKok} onChange={(e) => setForm((f) => ({ ...f, inkluderaKok: e.target.checked }))} />
                      Köket
                    </label>
                    <label className="boka-checkbox-label">
                      <input type="checkbox" checked={form.inkluderaLillaScen} onChange={(e) => setForm((f) => ({ ...f, inkluderaLillaScen: e.target.checked }))} />
                      Lilla scenen
                    </label>
                    <label className="boka-checkbox-label">
                      <input type="checkbox" checked={form.inkluderaStoraScen} onChange={(e) => setForm((f) => ({ ...f, inkluderaStoraScen: e.target.checked }))} />
                      Stora scenen
                    </label>
                  </div>
                </div>
              )}

              <div className="boka-grid-2">
                <div className="boka-field">
                  <label htmlFor="antalPersoner">Antal personer</label>
                  <input
                    type="number"
                    id="antalPersoner"
                    min="1"
                    placeholder="T.ex. 50"
                    value={form.antalPersoner}
                    onChange={set("antalPersoner")}
                  />
                </div>
                <div className="boka-field">
                  <label htmlFor="mobling">Möblering</label>
                  <select id="mobling" value={form.mobling} onChange={set("mobling")}>
                    <option value="">Välj…</option>
                    <option value="teater">Teater (stolsrader)</option>
                    <option value="klassrum">Klassrum (bord & stolar i rader)</option>
                    <option value="u-form">U-form (bord i U)</option>
                    <option value="bankett">Bankett (runda bord)</option>
                    <option value="cocktail">Cocktail (ståbord)</option>
                    <option value="ingen">Ingen möblering</option>
                  </select>
                </div>
              </div>

              {form.local ? (
                <>
                  <p className="boka-cal-instruction">
                    Välj ett ledigt datum i kalendern nedan.
                    {selectedDate && (
                      <strong> Valt datum: {formatDate(selectedDate)}</strong>
                    )}
                  </p>
                  <BookingCalendar
                    bookedDates={bookedDates}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    loading={loadingDates}
                  />
                </>
              ) : (
                <p className="boka-cal-instruction boka-cal-hint">
                  Välj en lokal ovan för att se tillgängliga datum.
                </p>
              )}
            </section>

            {/* Evenemang & tillval */}
            <section className="boka-section" id="step2-detaljer">
              <h2>Evenemang & tillval</h2>

              <div className="boka-field">
                <label htmlFor="eventType">Typ av evenemang</label>
                <select id="eventType" value={form.eventType} onChange={set("eventType")}>
                  <option value="">Välj…</option>
                  <option value="konsert">Konsert</option>
                  <option value="teater">Teater</option>
                  <option value="föreläsning">Föreläsning</option>
                  <option value="konferens">Konferens</option>
                  <option value="privat">Privat (bröllop m.m.)</option>
                  <option value="workshop">Workshop</option>
                  <option value="annat">Annat</option>
                </select>
              </div>

              {form.eventType === "annat" && (
                <div className="boka-field">
                  <label htmlFor="otherEventDescription">Beskriv ditt evenemang</label>
                  <textarea
                    id="otherEventDescription"
                    placeholder="Skriv här…"
                    value={form.otherEventDescription}
                    onChange={set("otherEventDescription")}
                  />
                </div>
              )}

              <div className="boka-grid-2">
                <div className="boka-field">
                  <label htmlFor="audioTech">Ljudtekniker</label>
                  <select id="audioTech" value={form.audioTech} onChange={set("audioTech")}>
                    <option value="nej">Nej</option>
                    <option value="ja">Ja (+1 500 kr)</option>
                    <option value="egen">Egen</option>
                  </select>
                </div>
                <div className="boka-field">
                  <label htmlFor="lightTech">Ljustekniker</label>
                  <select id="lightTech" value={form.lightTech} onChange={set("lightTech")}>
                    <option value="nej">Nej</option>
                    <option value="ja">Ja (+1 200 kr)</option>
                    <option value="egen">Egen</option>
                  </select>
                </div>
                <div className="boka-field">
                  <label htmlFor="extraPersonnel">Extra personal (antal)</label>
                  <input
                    type="number"
                    id="extraPersonnel"
                    min="0"
                    placeholder="0"
                    value={form.extraPersonnel}
                    onChange={set("extraPersonnel")}
                  />
                </div>
                <div className="boka-field">
                  <label htmlFor="catering">Catering</label>
                  <select id="catering" value={form.catering} onChange={set("catering")}>
                    <option value="nej">Nej</option>
                    <option value="ja">Ja (+2 000 kr)</option>
                  </select>
                </div>
              </div>

              <button type="button" onClick={calculatePrice} disabled={!form.local} className="boka-btn-secondary">
                Beräkna pris
              </button>
              {priceError && <p className="error">{priceError}</p>}
              {price > 0 && (
                <p className="boka-price-output">
                  Beräknat pris: {price.toLocaleString("sv-SE")} SEK
                </p>
              )}
            </section>

            {/* Mer kontaktinfo */}
            <section className="boka-section" id="step2-kontakt">
              <h2>Mer kontaktinfo</h2>

              <div className="boka-field">
                <label htmlFor="customerType">Typ av kund *</label>
                <select id="customerType" value={form.customerType} onChange={set("customerType")}>
                  <option value="">Välj…</option>
                  <option value="privatperson">Privatperson</option>
                  <option value="företag">Företag</option>
                  <option value="arrangör">Arrangör</option>
                </select>
              </div>

              {form.customerType === "företag" && (
                <div className="boka-field">
                  <label htmlFor="orgNumber">Organisationsnummer *</label>
                  <input
                    type="text"
                    id="orgNumber"
                    placeholder="ÅÅÅÅMMDD-XXXX"
                    value={form.orgNumber}
                    onChange={set("orgNumber")}
                  />
                </div>
              )}

              {form.customerType === "arrangör" && (
                <div className="boka-field">
                  <label htmlFor="orgNumber">Organisationsnummer (valfritt)</label>
                  <input
                    type="text"
                    id="orgNumber"
                    placeholder="ÅÅÅÅMMDD-XXXX"
                    value={form.orgNumber}
                    onChange={set("orgNumber")}
                  />
                </div>
              )}

              {form.customerType && (
                <div className="boka-field">
                  <label htmlFor="phone">Telefonnummer *</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="070-123 45 67"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
              )}
            </section>

            {/* Sammanfattning */}
            <section className="boka-section boka-section--summary" id="summarySection">
              <h3>Sammanfattning</h3>
              {summary}

              {submitError && (
                <p className="error" role="alert" aria-live="assertive">
                  {submitError}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={
                  !form.name ||
                  !form.email ||
                  !form.local ||
                  !selectedDate ||
                  !form.customerType ||
                  (form.customerType === "företag" && !form.orgNumber) ||
                  !form.phone
                }
                className="boka-btn-submit"
              >
                Skicka förfrågan
              </button>

              <p className="boka-disclaimer">
                Din bokning är en prelbokning tills vi bekräftar via e-post.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
