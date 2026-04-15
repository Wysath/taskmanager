"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

// Formulaire d'ajout de tâche accessible et conforme aux bonnes pratiques

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
      className="flex flex-col gap-4 mb-8 p-6 bg-surface-container-lowest rounded-xl shadow-sm sm:flex-row font-body border border-outline-variant/20"
      aria-label="Ajouter une tâche"
      autoComplete="off"
    >
      {error && (
        <div className="text-red-600 text-sm font-medium" role="alert">{error}</div>
      )}
      <div className="flex-1">
        <label
          htmlFor="task-title"
          className="block mb-1 text-on-surface font-headline font-medium"
        >
          Titre de la tâche
        </label>
        <input
          id="task-title"
          type="text"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Nouvelle tâche..."
          className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-highest px-4 text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
          required
          aria-required="true"
          aria-invalid={!!error}
          disabled={loading}
        />
      </div>

      <div className="relative sm:w-40 w-full">
        <label
          htmlFor="task-priority"
          className="block mb-1 text-on-surface font-headline font-medium"
        >
          Priorité
        </label>
        <select
          id="task-priority"
          value={taskPriority}
          onChange={(event) => setTaskPriority(event.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-lg border-none bg-surface-container-highest px-4 pr-10 font-medium text-on-surface focus:ring-2 focus:ring-primary-container"
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
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-primary to-primary-container px-8 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
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
