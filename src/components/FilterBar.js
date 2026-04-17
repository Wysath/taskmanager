"use client";
// Composant de filtre par statut pour les tâches
// Props : currentFilter (string), onFilterChange (function)

import { useMemo, useCallback } from "react";

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filters = useMemo(
    () => [
      { label: "Toutes", value: "all" },
      { label: "Actives", value: "active" },
      { label: "Complétées", value: "completed" },
    ],
    []
  );

  const handleFilterClick = useCallback(
    (value) => {
      onFilterChange(value);
    },
    [onFilterChange]
  );

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
              onClick={() => handleFilterClick(filter.value)}
              className={`px-4 py-2 rounded font-semibold text-[#151310] cursor-pointer transition-[background] duration-200 border border-[#c28e46] ${
                isActive
                  ? "bg-[#c28e46]"
                  : "bg-transparent hover:bg-[#c28e46]/10"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c28e46] focus-visible:ring-offset-2`}
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
