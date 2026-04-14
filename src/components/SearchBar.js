// Barre de recherche pour filtrer les tâches par texte
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-2 py-1 font-body border border-outline-variant/20">
      <label htmlFor="search-bar" className="sr-only">
        Recherche de tâche
      </label>
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Recherche..."
        className="w-40 sm:w-56 rounded-md bg-transparent px-2 py-1 text-sm text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
        aria-label="Recherche de tâche"
      />
    </div>
  );
};

export default SearchBar;
