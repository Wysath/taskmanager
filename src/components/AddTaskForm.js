"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const AddTaskForm = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("moyenne");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("[AddTaskForm.handleSubmit] Soumis avec title:", taskTitle, "priority:", taskPriority);
    setError("");
    const normalizedTitle = taskTitle.trim();
    if (!normalizedTitle) {
      setError("Le titre est obligatoire.");
      console.warn("[AddTaskForm.handleSubmit] Titre vide");
      return;
    }
    setLoading(true);
    try {
      console.log("[AddTaskForm.handleSubmit] Appel onAddTask");
      await onAddTask?.({
        title: normalizedTitle,
        priority: taskPriority,
      });
      console.log("[AddTaskForm.handleSubmit] Succès, rénitialisation du formulaire");
      setTaskTitle("");
      setTaskPriority("moyenne");
    } catch (err) {
      console.error("[AddTaskForm.handleSubmit] Erreur:", err);
      setError(err.message || "Erreur lors de l'ajout de la tâche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="task-form"
      aria-label="Ajouter une tâche"
      autoComplete="off"
    >
      {error && (
        <div className="text-error text-sm font-medium" role="alert">{error}</div>
      )}
      <div className="flex-1">
        <label
          htmlFor="task-title"
          className="form-label"
        >
          Titre de la tâche
        </label>
        <input
          id="task-title"
          type="text"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Nouvelle tâche..."
          className="input-text"
          required
          aria-required="true"
          aria-invalid={!!error}
          disabled={loading}
        />
      </div>

      <div className="relative sm:w-40 w-full">
        <label
          htmlFor="task-priority"
          className="form-label"
        >
          Priorité
        </label>
        <select
          id="task-priority"
          value={taskPriority}
          onChange={(event) => setTaskPriority(event.target.value)}
          className="select-base"
          aria-label="Sélectionner la priorité"
          disabled={loading}
        >
          <option value="haute">haute</option>
          <option value="moyenne">moyenne</option>
          <option value="basse">basse</option>
        </select>
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
