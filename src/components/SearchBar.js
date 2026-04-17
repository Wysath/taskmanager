"use client";
import { useCallback } from "react";

// Barre de recherche pour filtrer les tâches par texte
const SearchBar = ({ value, onChange }) => {
  // Optimisation : mémorise le callback pour éviter les rerenders inutiles si passé à des enfants dans le futur
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="search-bar">
      <label htmlFor="search-bar" className="sr-only">
        Recherche de tâche
      </label>
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Recherche..."
        className="search-input"
        aria-label="Recherche de tâche"
      />
    </div>
  );
};

export default SearchBar;
