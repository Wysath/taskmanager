"use client";
// Composant de filtre par statut pour les tâches
// Props : currentFilter (string), onFilterChange (function)

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { label: "Toutes", value: "all" },
    { label: "Actives", value: "active" },
    { label: "Complétées", value: "completed" },
  ];

  return (
    <nav aria-label="Filtrer les tâches">
      <div className="flex gap-2">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.value)}
              className={
                isActive
                  ? "bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
                  : "bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-lg hover:bg-surface-container transition-colors"
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default FilterBar;
