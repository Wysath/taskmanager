"use client";

import { CheckIcon, Pencil, Trash2 } from "lucide-react";

/**
 * Composant TaskItem
 * Props : 
 *  - id (string)
 *  - title (string)
 *  - description (string, optionnelle)
 *  - priority ("haute"/"moyenne"/"basse")
 *  - completed (boolean)
 *  - onToggle (function)
 *  - onDelete (function)
 */

const PRIORITY_COLORS = {
  haute: "bg-red-100 text-red-700",
  moyenne: "bg-orange-100 text-orange-700",
  basse: "bg-green-100 text-green-700",
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
    className={`p-6 bg-surface-container-low rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors group ${
      completed ? "opacity-60" : ""
    }`}
    data-task-id={id}
  >
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label={completed ? "Marquer comme non complétée" : "Marquer comme complétée"}
        onClick={() => onToggle?.(id)}
        className={`w-6 h-6 rounded-md border-2 border-outline-variant flex items-center justify-center cursor-pointer group-hover:border-primary-container ${
          completed
            ? "bg-primary border-primary bg-blue-600 border-blue-600"
            : "bg-transparent"
        }`}
      >
        {completed && (
          <CheckIcon
            size={14}
            strokeWidth={3}
            className="block shrink-0 text-white"
            aria-hidden="true"
          />
        )}
      </button>
      <div>
        <p
          className={`font-semibold text-on-surface ${
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
    {/* Actions d'édition/suppression visibles en permanence */}
    <div className="flex items-center gap-3 opacity-100 transition-opacity">
      <button
        className="p-2 text-outline hover:text-primary transition-colors cursor-pointer"
        type="button"
        aria-label="Modifier la tâche"
        onClick={() => onEdit?.(id)}
      >
        <Pencil size={16} aria-hidden="true" />
      </button>
      <button
        className="p-2 text-outline hover:text-error transition-colors cursor-pointer"
        type="button"
        aria-label="Supprimer la tâche"
        onClick={() => onDelete?.(id)}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  </div>
);

export default TaskItem;