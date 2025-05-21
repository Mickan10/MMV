import React from "react";
import "./EventList.css";

export default function EventList() {
  const events = [
    {
      img: "/Bilder/20241207_215011_972979.jpg",
      title: "Rock'n'Roll Konsert - The Wild Rebels",
      date: "15 januari 2025",
      time: "20:00",
      location: "Hard Rock Café, Skövde",
    },
    {
      img: "/Bilder/20241201_000118_24720.jpg",
      title: "Metal Mania Festival",
      date: "22 januari 2025",
      time: "18:00",
      location: "Globen Arena, Vara",
    },
    {
      img: "/Bilder/6.jpg",
      title: "Indie Night - The Soundwaves",
      date: "28 januari 2025",
      time: "21:00",
      location: "Musikaliska, Mariestad",
    },
    {
      img: "/Bilder/5.jpg",
      title: "Indie Night - The Soundwaves",
      date: "28 januari 2025",
      time: "21:00",
      location: "Musikaliska, Skövde",
    },
  ];

  return (
    <div className="upcoming-events">
      <div className="event-list">
        {events.map((event, index) => (
          <div className="event-item" key={index}>
            <img src={event.img} alt="Event Image" className="event-image" />
            <h3>{event.title}</h3>
            <p><strong>Datum:</strong> {event.date} | <strong>Tid:</strong> {event.time}</p>
            <p><strong>Plats:</strong> {event.location}</p>
          </div>
        ))}
      </div>
      <a href="/events" className="cta-button">Gå till eventkalendern</a>
    </div>
  );
}
