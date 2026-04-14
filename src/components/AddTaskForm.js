"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

// Formulaire d'ajout de tâche accessible et conforme aux bonnes pratiques
const AddTaskForm = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("moyenne");

  // Soumet le formulaire pour créer une nouvelle tâche
  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedTitle = taskTitle.trim();
    if (!normalizedTitle) return;

    onAddTask?.({
      title: normalizedTitle,
      priority: taskPriority,
    });

    setTaskTitle("");
    setTaskPriority("moyenne");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-8 p-6 bg-surface-container-lowest rounded-xl shadow-sm sm:flex-row"
      aria-label="Ajouter une tâche"
      autoComplete="off"
    >
      <div className="flex-1">
        {/* Label visible, accessible pour la navigation clavier/liseuse */}
        <label
          htmlFor="task-title"
          className="block mb-1 text-on-surface font-medium"
        >
          Titre de la tâche
        </label>
        <input
          id="task-title"
          type="text"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Nouvelle tâche..."
          className="h-12 w-full rounded-lg border-none bg-surface-container-highest px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container"
          required
          aria-required="true"
        />
      </div>

      <div className="relative sm:w-40 w-full">
        {/* Label visible pour la priorité */}
        <label
          htmlFor="task-priority"
          className="block mb-1 text-on-surface font-medium"
        >
          Priorité
        </label>
        <select
          id="task-priority"
          value={taskPriority}
          onChange={(event) => setTaskPriority(event.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-lg border-none bg-surface-container-highest px-4 pr-10 font-medium text-on-surface focus:ring-2 focus:ring-primary-container"
          aria-label="Sélectionner la priorité"
        >
          <option value="haute">haute</option>
          <option value="moyenne">moyenne</option>
          <option value="basse">basse</option>
        </select>
      </div>

      <button
        type="submit"
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90"
        aria-label="Ajouter la tâche"
      >
        {/* L'icône est décorative car le bouton possède du texte */}
        <Plus size={18} aria-hidden="true" focusable="false" />
        Ajouter
      </button>
    </form>
  );
};

export default AddTaskForm;
