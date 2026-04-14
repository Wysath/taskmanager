// Barre de recherche pour filtrer les tâches par texte
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-2 py-1">
      <label htmlFor="search-bar" className="sr-only">
        Recherche de tâche
      </label>
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Recherche..."
        className="w-40 sm:w-56 rounded-md bg-transparent px-2 py-1 text-sm text-on-surface focus:outline-none"
        aria-label="Recherche de tâche"
      />
    </div>
  );
};

export default SearchBar;
