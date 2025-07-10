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
    fetch("/MMV/events.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    const city = newFilters.city?.toLowerCase() ?? "";
    const date = newFilters.date ?? "";
    const genre = newFilters.genre?.toLowerCase() ?? "";

    const filtered = events.filter((event) => {
      const matchCity = !city || event.city.toLowerCase().includes(city);
      const matchDate = !date || event.date === date;
      const matchGenre = !genre || event.genre.toLowerCase().includes(genre);
      return matchCity && matchDate && matchGenre;
    });

    setFilteredEvents(filtered);
  };

  const resetFilters = () => {
    const reset = { city: "", date: "", genre: "" };
    setFilters(reset);
    setFilteredEvents(events);
  };

  return (
    <main>
      <SearchBar filters={filters} onFilterChange={handleFilterChange} />
      <button
        onClick={resetFilters}
        className="reset-button"
        style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}
      >
        Visa alla events
      </button>
      <EventCalendar events={filteredEvents} />
    </main>
  );
}

export default Events;
