"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Star } from "lucide-react";

const PRIORITY_LABELS = {
  1: "Basse",
  2: "Moyenne",
  3: "Haute",
};
const PRIORITY_TEXTS = {
  1: "basse",
  2: "moyenne",
  3: "haute",
};

const AddTaskForm = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const priorityLevels = useMemo(() => [1, 2, 3], []);

  const currentPriorityLabel = useMemo(() => PRIORITY_LABELS[taskPriority], [taskPriority]);

  const handleTitleChange = useCallback((event) => {
    setTaskTitle(event.target.value);
  }, []);

  const handlePriorityClick = useCallback(
    (level) => {
      setTaskPriority(level);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");
      const normalizedTitle = taskTitle.trim();
      if (!normalizedTitle) {
        setError("Le titre est obligatoire.");
        return;
      }
      setLoading(true);
      try {
        const priorityText = PRIORITY_TEXTS[taskPriority];
        await onAddTask?.({
          title: normalizedTitle,
          priority: priorityText,
        });
        setTaskTitle("");
        setTaskPriority(2);
      } catch (err) {
        setError(err.message || "Erreur lors de l'ajout de la tâche.");
      } finally {
        setLoading(false);
      }
    },
    [taskTitle, taskPriority, onAddTask]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="task-form"
      aria-label="Ajouter une tâche"
      autoComplete="off"
    >
      {error && (
        <div className="text-error text-sm font-medium" role="alert">
          {error}
        </div>
      )}
      <div className="flex-1">
        <label htmlFor="task-title" className="form-label">
          Titre de la tâche
        </label>
        <input
          id="task-title"
          type="text"
          value={taskTitle}
          onChange={handleTitleChange}
          placeholder="Nouvelle tâche..."
          className="input-text"
          required
          aria-required="true"
          aria-invalid={!!error}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col items-start gap-2 py-2">
        <label className="form-label">Priorité</label>
        <div
          className="flex items-center gap-1"
          role="radiogroup"
          aria-label="Sélectionner la priorité"
        >
          {priorityLevels.map((level) => (
            <button
              key={level}
              type="button"
              className={`p-1 rounded focus:outline-none ${taskPriority >= level ? "text-yellow-400" : "text-gray-300"}`}
              aria-label={
                level === 3
                  ? "Haute priorité"
                  : level === 2
                  ? "Priorité moyenne"
                  : "Basse priorité"
              }
              aria-pressed={taskPriority === level}
              onClick={() => handlePriorityClick(level)}
              disabled={loading}
            >
              <Star fill={taskPriority >= level ? "#facc15" : "none"} strokeWidth={2} size={24} />
            </button>
          ))}
          <span className="ml-2 text-sm font-medium text-gray-500">
            {currentPriorityLabel}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full sm:w-auto"
        aria-label="Ajouter la tâche"
        disabled={loading}
      >
        <Plus size={18} aria-hidden="true" focusable="false" />
        {loading ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
};

export default AddTaskForm;
