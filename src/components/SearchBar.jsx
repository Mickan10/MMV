import React, { useState, useEffect } from "react";
import "../pages/Events.css";

const SearchBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    city: "",
    date: "",
    genre: "",
  });

  // Anropa onFilterChange varje gång filters ändras - live filter
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Vi kan antingen ta bort submit helt eller göra den till reset
  const handleSubmit = (e) => {
    e.preventDefault();
    // Om du vill kan du göra reset på submit:
    // setFilters({ city: "", date: "", genre: "" });
    // Eller helt enkelt göra inget, eftersom vi filtrerar live.
  };

  return (
    <section className="search-container">
      <h2>Sök Evenemang</h2>
      <form id="search-form" onSubmit={handleSubmit}>
        <label htmlFor="city">Stad:</label>
        <select id="city" name="city" value={filters.city} onChange={handleChange}>
          <option value="">Välj stad</option>
          <option value="skövde">Skövde</option>
          <option value="vara">Vara</option>
          <option value="skara">Skara</option>
          <option value="mariestad">Mariestad</option>
        </select>

        <label htmlFor="date">Datum:</label>
        <input type="date" id="date" name="date" value={filters.date} onChange={handleChange} />

        <label htmlFor="genre">Genre:</label>
        <select id="genre" name="genre" value={filters.genre} onChange={handleChange}>
          <option value="">Välj genre</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="metal">Metal</option>
        </select>

        <button type="submit">Sök</button>
      </form>
    </section>
  );
};

export default SearchBar;
