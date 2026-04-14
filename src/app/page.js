"use client";

import { useState } from "react";
import {
  Archive,
  Bell,
  CalendarDays,
  CheckSquare,
  CircleDot,
  Filter,
  GitBranch,
  LayoutDashboard,
  Search,
  Settings,
} from "lucide-react";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

const initialTaskItems = [
  {
    id: 1,
    title: "Revue de projet",
    description: "Préparer la synthèse pour la réunion de 14:00",
    priority: "haute", // haute > moyenne > basse
    completed: false,
    date: new Date("2024-06-01T10:00:00Z"),
  },
  {
    id: 2,
    title: "Appel client",
    description: "Point de suivi avec Jean Dupont",
    priority: "moyenne",
    completed: false,
    date: new Date("2024-06-03T15:00:00Z"),
  },
  {
    id: 3,
    title: "Préparation présentation",
    description: "Finaliser les slides du comité",
    priority: "basse",
    completed: false,
    date: new Date("2024-06-02T09:00:00Z"),
  },
];

export default function Home() {
  // --- États principaux requis ---
  const [tasks, setTasks] = useState(initialTaskItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [sortOrder, setSortOrder] = useState("priority"); // 'priority', 'date'

  // Pour gestion modales édition/suppression (hors sujet prompt, mais utiles pour TaskList demo)
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState(null);

  // Ordre pour tri de priorité
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1 };

  // --- Filtrage, Recherche, Tri ---
  let displayedTasks = tasks
    // Recherche par titre (case-insensitive substring)
    .filter((task) => {
      if (!searchQuery.trim()) return true;
      return task.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
    })
    // Filtre statut
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true; // 'all'
    });

  if (sortOrder === "priority") {
    displayedTasks = [...displayedTasks].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  } else if (sortOrder === "date") {
    displayedTasks = [...displayedTasks].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // --- Gestion ajout/édition/suppression ---
  const handleAddTask = ({ title, priority }) => {
    setTasks((currentTasks) => {
      const nextId =
        currentTasks.length > 0
          ? Math.max(...currentTasks.map((task) => task.id)) + 1
          : 1;
      return [
        {
          id: nextId,
          title,
          description: "",
          priority,
          completed: false,
          date: new Date(),
        },
        ...currentTasks,
      ];
    });
  };

  // Fonctions pour TaskList (utiles pour la démo) --
  const handleToggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (id) => {
    const targetTask = tasks.find((task) => task.id === id);
    if (!targetTask) return;
    setEditingTaskId(id);
    setDraftTaskTitle(targetTask.title);
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setDraftTaskTitle("");
  };

  const handleConfirmEditTask = () => {
    const nextTitle = draftTaskTitle.trim();
    if (!nextTitle || editingTaskId == null) return;
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingTaskId ? { ...task, title: nextTitle } : task
      )
    );
    handleCancelEditTask();
  };

  const handleRequestDeleteTask = (id) => {
    setPendingDeleteTaskId(id);
  };

  const handleCancelDeleteTask = () => {
    setPendingDeleteTaskId(null);
  };

  const handleConfirmDeleteTask = () => {
    if (pendingDeleteTaskId == null) return;
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== pendingDeleteTaskId)
    );
    setPendingDeleteTaskId(null);
  };

  return (
    <main className="min-h-screen bg-surface text-on-surface md:flex">
      {/* Barre laterale desktop */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col gap-4 border-r border-outline-variant/10 bg-surface-container py-8 md:flex">
        <div className="mb-8 px-8">
          <h1 className="text-xl font-extrabold tracking-tight text-primary">
            The Executive
          </h1>
          <p className="text-xs uppercase tracking-wide text-on-surface-variant/70">
            Productivity Portal
          </p>
        </div>
        <nav className="flex flex-col gap-1 pr-4" aria-label="Navigation laterale">
          <a
            href="#"
            className="flex items-center gap-4 rounded-r-full bg-surface-container-lowest px-8 py-3 font-semibold text-primary transition-all duration-300"
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            <span className="text-sm">Sanctuary</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-8 py-3 text-on-surface-variant transition-transform duration-300 hover:translate-x-1"
          >
            <GitBranch size={18} aria-hidden="true" />
            <span className="text-sm">Projects</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-8 py-3 text-on-surface-variant transition-transform duration-300 hover:translate-x-1"
          >
            <CircleDot size={18} aria-hidden="true" />
            <span className="text-sm">Focus</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-8 py-3 text-on-surface-variant transition-transform duration-300 hover:translate-x-1"
          >
            <Archive size={18} aria-hidden="true" />
            <span className="text-sm">Archive</span>
          </a>
        </nav>
      </aside>
      <section className="min-w-0 flex-1 bg-[#f8fafc]">
        {/* Barre superieure contenu */}
        <header className="sticky top-16 z-30 w-full bg-surface">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">
              Executive Flow
            </h2>
            <div className="flex items-center gap-4">
              <button
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
                type="button"
                aria-label="Calendrier"
              >
                <CalendarDays size={20} aria-hidden="true" />
              </button>
              <button
                className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
                type="button"
                aria-label="Notifications"
              >
                <Bell size={20} aria-hidden="true" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tertiary" />
              </button>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-4xl font-extrabold tracking-tight text-on-surface">
                Mes Tâches
              </h3>
              <p className="mt-2 text-lg text-on-surface-variant">
                Organisez votre flux de travail architectural.
              </p>
            </div>
          </header>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar filter={filter} onFilterChange={setFilter} />
            <div className="rounded-lg bg-surface-container-high px-2 py-1 text-on-surface-variant">
              <label htmlFor="sort-order" className="sr-only">
                Trier par
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="cursor-pointer rounded-md bg-transparent px-2 py-1 text-sm focus:outline-none"
              >
                <option value="priority">Tri par priorité</option>
                <option value="date">Tri par date</option>
              </select>
            </div>
          </div>
          <AddTaskForm onAddTask={handleAddTask} />
          <TaskList
            tasks={displayedTasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleRequestDeleteTask}
          />
        </div>
      </section>
      {/* Navigation mobile flottante */}
      <nav className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center justify-between rounded-full border border-white/20 bg-white/70 px-6 py-2 shadow-[0px_20px_40px_rgba(25,27,35,0.06)] backdrop-blur-xl md:hidden">
        <a
          href="#"
          className="flex flex-col items-center rounded-full bg-linear-to-r from-[#003d9b] to-[#0052cc] px-4 py-1 text-white"
        >
          <CheckSquare size={18} aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-widest">Tasks</span>
        </a>
        <a
          href="#"
          className="ml-4 flex flex-col items-center text-on-surface-variant transition-all hover:opacity-80"
        >
          <Search size={18} aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-widest">Search</span>
        </a>
        <a
          href="#"
          className="ml-4 flex flex-col items-center text-on-surface-variant transition-all hover:opacity-80"
        >
          <Settings size={18} aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-widest">Settings</span>
        </a>
      </nav>
      {/* Modale suppression */}
      {pendingDeleteTaskId != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmation de suppression"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h4 className="text-lg font-bold text-zinc-900">
              Supprimer cette tâche ?
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              Cette action est irréversible. Voulez-vous continuer ?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDeleteTask}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTask}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modale édition */}
      {editingTaskId != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Modification de tâche"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h4 className="text-lg font-bold text-zinc-900">
              Modifier la tâche
            </h4>
            <label htmlFor="edit-task-title" className="mt-3 block text-sm text-zinc-600">
              Nouveau titre
            </label>
            <input
              id="edit-task-title"
              type="text"
              value={draftTaskTitle}
              onChange={(event) => setDraftTaskTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Saisissez un titre"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEditTask}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmEditTask}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
