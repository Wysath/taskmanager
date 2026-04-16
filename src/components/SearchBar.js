// Barre de recherche pour filtrer les tâches par texte
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <label htmlFor="search-bar" className="sr-only">
        Recherche de tâche
      </label>
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Recherche..."
        className="search-input"
        aria-label="Recherche de tâche"
      />
    </div>
  );
};

export default SearchBar;
