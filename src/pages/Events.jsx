import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import EventCalendar from "../components/EventCalendar";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    date: "",
    genre: "",
  });

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data); // visa alla events från början
      })
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Säkerställ att filtervärden är strängar innan trim
    const city = (newFilters.city || "").trim();
    const date = (newFilters.date || "").trim();
    const genre = (newFilters.genre || "").trim();

    if (!city && !date && !genre) {
      // Om inga filter valda, visa alla events
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      const matchCity =
        !city || event.city.toLowerCase().includes(city.toLowerCase());
      const matchDate = !date || event.date === date;
      const matchGenre =
        !genre || event.genre.toLowerCase().includes(genre.toLowerCase());
      return matchCity && matchDate && matchGenre;
    });

    setFilteredEvents(filtered);
  };

  return (
    <main>
      <SearchBar onFilterChange={handleFilterChange} />
      <EventCalendar events={filteredEvents} />
    </main>
  );
}

export default Events;
