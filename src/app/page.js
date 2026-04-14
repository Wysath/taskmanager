"use client";

import { useMemo, useState } from "react";
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

const initialTaskItems = [
  {
    id: 1,
    title: "Revue de projet",
    description: "Préparer la synthèse pour la réunion de 14:00",
    priority: "haute",
    completed: false,
  },
  {
    id: 2,
    title: "Appel client",
    description: "Point de suivi avec Jean Dupont",
    priority: "moyenne",
    completed: false,
  },
  {
    id: 3,
    title: "Préparation présentation",
    description: "Finaliser les slides du comité",
    priority: "basse",
    completed: false,
  },
];

export default function Home() {
  const [taskItems, setTaskItems] = useState(initialTaskItems);
  const [priorityFilter, setPriorityFilter] = useState("toutes");
  const [statusFilter, setStatusFilter] = useState("toutes");
  const [sortMode, setSortMode] = useState("recent");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState(null);
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1 };

  // Construit la liste visible en fonction des filtres et du tri
  const visibleTaskItems = useMemo(() => {
    const filteredTasks = taskItems.filter((taskItem) => {
      const matchesPriority =
        priorityFilter === "toutes" || taskItem.priority === priorityFilter;
      const matchesStatus =
        statusFilter === "toutes" ||
        (statusFilter === "actives" && !taskItem.completed) ||
        (statusFilter === "completees" && taskItem.completed);
      return matchesPriority && matchesStatus;
    });

    return [...filteredTasks].sort((taskA, taskB) => {
      if (sortMode === "priority_desc") {
        return priorityOrder[taskB.priority] - priorityOrder[taskA.priority];
      }
      if (sortMode === "priority_asc") {
        return priorityOrder[taskA.priority] - priorityOrder[taskB.priority];
      }
      if (sortMode === "title_asc") {
        return taskA.title.localeCompare(taskB.title, "fr");
      }
      if (sortMode === "title_desc") {
        return taskB.title.localeCompare(taskA.title, "fr");
      }
      return taskB.id - taskA.id;
    });
  }, [taskItems, priorityFilter, statusFilter, sortMode]);

  // Bascule l'etat complete d'une tache
  const handleToggleTask = (targetTaskId) => {
    setTaskItems((currentTaskItems) =>
      currentTaskItems.map((taskItem) =>
        taskItem.id === targetTaskId
          ? { ...taskItem, completed: !taskItem.completed }
          : taskItem
      )
    );
  };

  // Supprime une tache de la liste
  const handleDeleteTask = (targetTaskId) => {
    setTaskItems((currentTaskItems) =>
      currentTaskItems.filter((taskItem) => taskItem.id !== targetTaskId)
    );
  };

  // Ajoute une nouvelle tache avec titre et priorite
  const handleAddTask = ({ title, priority }) => {
    setTaskItems((currentTaskItems) => {
      const nextId =
        currentTaskItems.length > 0
          ? Math.max(...currentTaskItems.map((taskItem) => taskItem.id)) + 1
          : 1;

      return [
        {
          id: nextId,
          title,
          description: "",
          priority,
          completed: false,
        },
        ...currentTaskItems,
      ];
    });
  };

  // Ouvre la modale d'edition
  const handleEditTask = (targetTaskId) => {
    const targetTask = taskItems.find((taskItem) => taskItem.id === targetTaskId);
    if (!targetTask) return;
    setEditingTaskId(targetTaskId);
    setDraftTaskTitle(targetTask.title);
  };

  // Annule l'edition en cours
  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setDraftTaskTitle("");
  };

  // Confirme l'edition du titre
  const handleConfirmEditTask = () => {
    const nextTitle = draftTaskTitle.trim();
    if (!nextTitle || editingTaskId == null) return;

    setTaskItems((currentTaskItems) =>
      currentTaskItems.map((taskItem) =>
        taskItem.id === editingTaskId ? { ...taskItem, title: nextTitle } : taskItem
      )
    );
    handleCancelEditTask();
  };

  // Ouvre la modale de confirmation de suppression
  const handleRequestDeleteTask = (targetTaskId) => {
    setPendingDeleteTaskId(targetTaskId);
  };

  // Annule la suppression
  const handleCancelDeleteTask = () => {
    setPendingDeleteTaskId(null);
  };

  // Confirme puis supprime la tâche
  const handleConfirmDeleteTask = () => {
    if (pendingDeleteTaskId == null) return;
    handleDeleteTask(pendingDeleteTaskId);
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
          <header className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-4xl font-extrabold tracking-tight text-on-surface">
                Mes Tâches
              </h3>
              <p className="mt-2 text-lg text-on-surface-variant">
                Organisez votre flux de travail architectural.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-2 py-1 text-on-surface-variant">
                <Filter size={18} aria-hidden="true" />
                <label htmlFor="priority-filter" className="sr-only">
                  Filtrer par priorité
                </label>
                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  className="cursor-pointer rounded-md bg-transparent px-2 py-1 text-sm focus:outline-none"
                >
                  <option value="toutes">Toutes priorités</option>
                  <option value="haute">Haute</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="basse">Basse</option>
                </select>
              </div>

              <div className="rounded-lg bg-surface-container-high px-2 py-1 text-on-surface-variant">
                <label htmlFor="status-filter" className="sr-only">
                  Filtrer par statut
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="cursor-pointer rounded-md bg-transparent px-2 py-1 text-sm focus:outline-none"
                >
                  <option value="toutes">Tous statuts</option>
                  <option value="actives">Actives</option>
                  <option value="completees">Complétées</option>
                </select>
              </div>

              <div className="rounded-lg bg-surface-container-high px-2 py-1 text-on-surface-variant">
                <label htmlFor="sort-mode" className="sr-only">
                  Mode de tri
                </label>
                <select
                  id="sort-mode"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                  className="cursor-pointer rounded-md bg-transparent px-2 py-1 text-sm focus:outline-none"
                >
                  <option value="recent">Plus récentes</option>
                  <option value="priority_desc">Priorité décroissante</option>
                  <option value="priority_asc">Priorité croissante</option>
                  <option value="title_asc">Titre A-Z</option>
                  <option value="title_desc">Titre Z-A</option>
                </select>
              </div>
            </div>
          </header>

          <AddTaskForm onAddTask={handleAddTask} />

          <TaskList
            taskItems={visibleTaskItems}
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
          className="flex flex-col items-center rounded-full bg-gradient-to-r from-[#003d9b] to-[#0052cc] px-4 py-1 text-white"
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
