import React, { useState } from "react";

function EventCalendar({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);

  function getDaysInMonth(year, month) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  function changeMonth(offset) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelectedDate(null);
  }

  function eventsForDay(day) {
    const dayString = day.toISOString().split("T")[0];
    return events.filter((event) => event.date === dayString);
  }

  // Filtera fram event som är idag eller i framtiden
  const todayString = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((event) => event.date >= todayString);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  return (
    <div className="container-evente">
      {/* Kalender */}
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => changeMonth(-1)}>
            {"<"}
          </button>
          <div className="month-year">
            {currentDate.toLocaleString("sv-SE", { month: "long", year: "numeric" })}
          </div>
          <button className="nav-button" onClick={() => changeMonth(1)}>
            {">"}
          </button>
        </div>

        <div className="weekdays">
          {["M", "T", "O", "T", "F", "L", "S"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="days">
          {daysInMonth.map((day) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected =
              selectedDate &&
              day.toISOString().split("T")[0] === selectedDate.toISOString().split("T")[0];
            const hasEvents = eventsForDay(day).length > 0;

            let className = "";
            if (isToday) className += " today";
            if (hasEvents) className += " event-day";
            if (isSelected) className += " selected";

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={className.trim()}
                title={hasEvents ? `${eventsForDay(day).length} event` : ""}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Eventlista */}
      <div className="events-container">
        {selectedDate ? (
          // Visa detaljer för event på vald dag
          eventsForDay(selectedDate).length > 0 ? (
            eventsForDay(selectedDate).map((event) => (
              <div
                key={event.name + event.date}
                className="event-poster"
                onClick={() => setExpandedEvent(event)}
                style={{ cursor: "pointer" }}
              >
                <img src={event.image} alt={event.name} />
                <h4>{event.name}</h4>
                <p><b>Stad:</b> {event.city}</p>
                <p><b>Genre:</b> {event.genre}</p>
                <p>{event.description}</p> {/* Full beskrivning */}
                {event.extraInfo && <p className="extra-info">{event.extraInfo}</p>} {/* Extra info visas här */}
              </div>
            ))
          ) : (
            <p>Inga evenemang denna dag.</p>
          )
        ) : (
          // Visa bara grundinfo för framtida event när inget datum valt
          upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div
                key={event.name + event.date}
                className="event-poster"
                onClick={() => setExpandedEvent(event)}
                style={{ cursor: "pointer" }}
              >
                <img src={event.image} alt={event.name} />
                <h4>{event.name}</h4>
                <p><b>Stad:</b> {event.city}</p>
                <p><b>Genre:</b> {event.genre}</p>
                {/* Ingen full beskrivning här */}
              </div>
            ))
          ) : (
            <p>Inga kommande evenemang att visa.</p>
          )
        )}
      </div>

      {/* Expanderat event overlay/modal */}
      {expandedEvent && (
        <div
          className="event-expanded-overlay"
          onClick={() => setExpandedEvent(null)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="event-expanded"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "15px",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "30px",
              position: "relative",
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            }}
          >
            <button
              onClick={() => setExpandedEvent(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
              aria-label="Stäng"
            >
              ✕
            </button>
            <img
              src={expandedEvent.image}
              alt={expandedEvent.name}
              style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }}
            />
            <h2>{expandedEvent.name}</h2>
            <p><b>Datum:</b> {expandedEvent.date}</p>
            <p><b>Stad:</b> {expandedEvent.city}</p>
            <p><b>Genre:</b> {expandedEvent.genre}</p>
            <p>{expandedEvent.description}</p>
            {expandedEvent.extraInfo && (
              <p className="extra-info">{expandedEvent.extraInfo}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventCalendar;
