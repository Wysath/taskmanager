"use client";

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
}) => (
  <div
    className={`p-6 bg-surface-container-low rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors group font-body border border-outline-variant/20 ${
      completed ? "opacity-60" : ""
    }`}
    data-task-id={id}
  >
    <div className="flex items-center gap-4">
      {/* Bouton de complétion, accessible, aria-label dynamique */}
      <button
        type="button"
        aria-label={completed ? "Marquer comme non complétée" : "Marquer comme complétée"}
        onClick={() => onToggle?.(id)}
        className={`w-6 h-6 rounded-md border-2 border-outline-variant flex items-center justify-center cursor-pointer group-hover:border-primary-container transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 ${
          completed
            ? "bg-primary border-primary"
            : "bg-transparent"
        }`}
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
      <div>
        <p
          className={`font-semibold text-on-surface font-headline ${
            completed ? "line-through" : ""
          }`}
        >
          {title}
        </p>
        {description && (
          <p className="text-sm text-on-surface-variant">{description}</p>
        )}
        <span
          className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded
          ${
            PRIORITY_COLORS[priority] ||
            "bg-outline text-on-surface-variant"
          }
        `}
        >
          {completed
            ? "Complété"
            : PRIORITY_LABELS[priority] || "Priorité inconnue"}
        </span>
      </div>
    </div>
    {/* Actions éditer/supprimer, boutons accessibles avec aria-label, icônes aria-hidden */}
    <div className="flex items-center gap-3 opacity-100 transition-opacity">
      <button
        className="p-2 text-outline hover:text-primary transition-colors cursor-pointer"
        type="button"
        aria-label="Modifier la tâche"
        onClick={() => onEdit?.(id)}
      >
        <Pencil size={16} aria-hidden="true" focusable="false" />
      </button>
      <button
        className="p-2 text-outline hover:text-error transition-colors cursor-pointer"
        type="button"
        aria-label="Supprimer la tâche"
        onClick={() => onDelete?.(id)}
      >
        <Trash2 size={16} aria-hidden="true" focusable="false" />
      </button>
    </div>
  </div>
);

export default TaskItem;