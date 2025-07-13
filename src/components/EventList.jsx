import test3 from "../assets/test3.jpg";
import "./EventList.css";
import { Link } from "react-router-dom";


export default function EventList() {
  const events = [
    {
      img: test3,
      title: "Rock'n'Roll Konsert - The Wild Rebels",
      date: "15 januari 2025",
      time: "20:00",
      location: "Hard Rock Café, Skövde",
    },
    {
      img: test3,
      title: "Metal Mania Festival",
      date: "22 januari 2025",
      time: "18:00",
      location: "Globen Arena, Vara",
    },
    {
      img: test3,
      title: "Indie Night - The Soundwaves",
      date: "28 januari 2025",
      time: "21:00",
      location: "Musikaliska, Mariestad",
    },
  ];

  return (
  <div className="upcoming-events">
    <h2 className="event-heading">Aktuella Evenemang</h2> {/* Rubrik */}
    
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

    <Link to="/events" className="cta-button">Gå till eventkalendern</Link>
  </div>
);
}
