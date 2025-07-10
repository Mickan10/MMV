import React from "react";
import "../pages/Events.css";

const SearchBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // vi hanterar allt på ändring
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
        <input
          type="date"
          id="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
        />

        <label htmlFor="genre">Genre:</label>
        <select id="genre" name="genre" value={filters.genre} onChange={handleChange}>
          <option value="">Välj genre</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="metal">Metal</option>
          <option value="jazz">Jazz</option>
          <option value="indie">Indie</option>
        </select>
      </form>
    </section>
  );
};

export default SearchBar;
