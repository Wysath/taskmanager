"use client";

import { useMemo, useCallback } from "react";
import { CheckIcon, Pencil, Trash2 } from "lucide-react";

// Harmonisation : on utilise les classes Tailwind personnalisées
const PRIORITY_COLORS = {
  haute: "bg-error-container text-error",
  moyenne: "bg-secondary-container text-on-secondary-container",
  basse: "bg-primary-container text-on-primary-container",
};

const PRIORITY_LABELS = {
  haute: "Haute Priorité",
  moyenne: "Moyenne Priorité",
  basse: "Basse Priorité",
};

const TaskItem = ({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onEdit,
  onDelete,
  addedBy,
}) => {
  // Mémoïse la couleur et le label pour éviter le calcul à chaque rendu
  const priorityColorClass = useMemo(
    () => PRIORITY_COLORS[priority] || "bg-outline text-on-surface-variant",
    [priority]
  );

  const priorityLabel = useMemo(
    () => PRIORITY_LABELS[priority] || "Priorité inconnue",
    [priority]
  );

  // useCallback pour éviter la recréation des fonctions (optimisation perf)
  const handleToggle = useCallback(() => onToggle?.(id), [onToggle, id]);
  const handleEdit = useCallback(() => onEdit?.(id), [onEdit, id]);
  const handleDelete = useCallback(() => onDelete?.(id), [onDelete, id]);

  // Mémoïse la classe du conteneur principal
  const rootClassName = useMemo(
    () =>
      `p-6 bg-surface-container-low rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors group font-body border border-outline-variant/20${
        completed ? " opacity-60" : ""
      }`,
    [completed]
  );

  // Mémoïse la classe du bouton de complétion
  const toggleClassName = useMemo(
    () =>
      `w-6 h-6 border border-outline-variant flex items-center justify-center cursor-pointer group-hover:border-primary-container transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 bg-[#151310]${
        completed ? " border-primary" : ""
      }`,
    [completed]
  );

  // Mémoïse la classe du titre (évite recalcul systématique)
  const titleClassName = useMemo(
    () =>
      `font-semibold text-on-surface font-headline${completed ? " line-through" : ""}`,
    [completed]
  );

  return (
    <div className={rootClassName} data-task-id={id}>
      <div className="flex items-center gap-4">
        {/* Affiche soit la checkbox, soit le badge "Validé" (ils se remplacent l'un l'autre) */}
        {completed ? (
          <button
            type="button"
            aria-label="Marquer comme non complétée"
            onClick={handleToggle}
            className="flex-shrink-0 text-[#22c55e] cursor-pointer font-semibold transition-all px-3 py-1 border border-[#22c55e] rounded hover:bg-[#22c55e] hover:text-[#151310]"
          >
            Validé
          </button>
        ) : (
          <button
            type="button"
            aria-label="Marquer comme complétée"
            onClick={handleToggle}
            className={toggleClassName}
          >
            {completed && (
              <CheckIcon
                size={14}
                strokeWidth={3}
                className="block shrink-0 text-white"
                aria-hidden="true"
                focusable="false"
              />
            )}
          </button>
        )}
        <div>
          <p className={titleClassName}>{title}</p>
          {addedBy ? (
            <p className="text-xs text-on-surface-variant mt-1">Ajoutée par : {addedBy}</p>
          ) : null}
          <span
            className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${priorityColorClass}`}
          >
            {completed ? "Complété" : priorityLabel}
          </span>
        </div>
      </div>
      {/* Actions: Controls accessibles avec aria-label, icônes aria-hidden */}
      <div className="flex items-center gap-3 opacity-100 transition-opacity">
        <button
          className="text-[#c28e46] border border-[#c28e46] rounded p-2 hover:bg-[#c28e46] hover:text-[#e3d5b8] transition-colors duration-200 cursor-pointer"
          type="button"
          aria-label="Modifier la tâche"
          onClick={handleEdit}
        >
          <Pencil size={16} aria-hidden="true" focusable="false" />
        </button>
        <button
          className="text-[#c28e46] border border-[#c28e46] rounded p-2 hover:bg-[#c28e46] hover:text-[#e3d5b8] transition-colors duration-200 cursor-pointer"
          type="button"
          aria-label="Supprimer la tâche"
          onClick={handleDelete}
        >
          <Trash2 size={16} aria-hidden="true" focusable="false" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;