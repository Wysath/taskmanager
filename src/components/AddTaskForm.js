"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const AddTaskForm = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("moyenne");

  // Soumet le formulaire pour creer une nouvelle tache
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
    >
      <div className="flex-1">
        <label htmlFor="task-title" className="sr-only">
          Titre de la tâche
        </label>
        <input
          id="task-title"
          type="text"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Nouvelle tâche..."
          className="h-12 w-full rounded-lg border-none bg-surface-container-highest px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container"
        />
      </div>

      <div className="relative">
        <label htmlFor="task-priority" className="sr-only">
          Priorité
        </label>
        <select
          id="task-priority"
          value={taskPriority}
          onChange={(event) => setTaskPriority(event.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-lg border-none bg-surface-container-highest px-4 pr-10 font-medium text-on-surface focus:ring-2 focus:ring-primary-container sm:w-40"
        >
          <option value="haute">haute</option>
          <option value="moyenne">moyenne</option>
          <option value="basse">basse</option>
        </select>
      </div>

      <button
        type="submit"
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90"
      >
        <Plus size={18} aria-hidden="true" />
        Ajouter
      </button>
    </form>
  );
};

export default AddTaskForm;
