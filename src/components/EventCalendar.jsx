import React, { useState } from "react";
import "../pages/Events.css";

function EventCalendar({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  return (
    <div className="container-evente">
      {/* Kalender */}
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => changeMonth(-1)}>{"<"}</button>
          <div className="month-year">
            {currentDate.toLocaleString("sv-SE", { month: "long", year: "numeric" })}
          </div>
          <button className="nav-button" onClick={() => changeMonth(1)}>{">"}</button>
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
          eventsForDay(selectedDate).length > 0 ? (
            eventsForDay(selectedDate).map((event) => (
              <div key={event.name + event.date} className="event-poster">
                <img src={event.image} alt={event.name} />
                <h4>{event.name}</h4>
                <p><b>Stad:</b> {event.city}</p>
                <p><b>Genre:</b> {event.genre}</p>
                <p>{event.description}</p>
              </div>
            ))
          ) : (
            <p>Inga evenemang denna dag.</p>
          )
        ) : (
          <p>Välj en dag för att se evenemang.</p>
        )}
      </div>
    </div>
  );
}

export default EventCalendar;
