"use client";

import { useState } from "react";
import {
  Archive,
  Bell,
  Calendar,
  CheckSquare,
  Circle,
  Filter,
  GitBranch,
  Home as HomeIcon,
  ListChecks,
  User,
  Settings,
  Search,
} from "lucide-react";
import Link from "next/link";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";
import Dashboard from "../components/Dashboard";

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

// Rappel : la balise <html lang="fr"> est à intégrer dans le fichier racine _document.js ou layout.js de Next.js pour application globale.

export default function Home() {
  // --- États principaux ---
  const [tasks, setTasks] = useState(initialTaskItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'completed'
  const [prioritySort, setPrioritySort] = useState("none"); // 'none', 'highToLow', 'lowToHigh'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState(null);
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1 };

  // --- Logique de filtrage et triage ---
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        (task.description && task.description.toLowerCase().includes(q))
      );
    })
    .filter((task) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return !task.completed;
      if (statusFilter === "completed") return task.completed;
      return true;
    });

  let finalTasks = [...filteredAndSortedTasks];
  if (prioritySort === "highToLow") {
    finalTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else if (prioritySort === "lowToHigh") {
    finalTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  // --- Fonctions de gestion ---
  const handleToggleTask = (targetTaskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === targetTaskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (targetTaskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== targetTaskId)
    );
  };

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
        },
        ...currentTasks,
      ];
    });
  };

  const handleEditTask = (targetTaskId) => {
    const targetTask = tasks.find((task) => task.id === targetTaskId);
    if (!targetTask) return;
    setEditingTaskId(targetTaskId);
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

  const handleRequestDeleteTask = (targetTaskId) => {
    setPendingDeleteTaskId(targetTaskId);
  };

  const handleCancelDeleteTask = () => {
    setPendingDeleteTaskId(null);
  };

  const handleConfirmDeleteTask = () => {
    if (pendingDeleteTaskId == null) return;
    handleDeleteTask(pendingDeleteTaskId);
    setPendingDeleteTaskId(null);
  };

  return (
    <main className="min-h-screen bg-surface text-on-surface md:flex" tabIndex={-1}>
      {/* Barre laterale desktop */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col gap-4 border-r border-outline-variant/10 bg-surface-container py-8 md:flex">
        <div className="mb-8 px-8">
          <h1 className="text-xl font-extrabold tracking-tight text-primary">
            Tableau de bord
          </h1>
          <p className="text-xs uppercase tracking-wide text-on-surface-variant/70">
            Portail de productivité
          </p>
        </div>

        <nav className="flex flex-col gap-1 pr-4" aria-label="Navigation principale latérale">
          <Link
            href="/"
            className="flex items-center gap-4 rounded-r-full bg-surface-container-lowest px-8 py-3 font-semibold text-primary transition-all duration-300 focus:outline-2 focus:outline-primary"
            tabIndex={0}
            aria-label="Accueil"
          >
            <HomeIcon size={18} aria-hidden="true" role="img" focusable="false" />
            <span className="text-sm">Accueil</span>
          </Link>
          <Link
            href="/taches"
            className="flex items-center gap-4 px-8 py-3 text-on-surface-variant transition-transform duration-300 hover:translate-x-1 focus:outline-2 focus:outline-primary"
            tabIndex={0}
            aria-label="Tâches"
          >
            <ListChecks size={18} aria-hidden="true" role="img" focusable="false" />
            <span className="text-sm">Tâches</span>
          </Link>
          <Link
            href="/profil"
            className="flex items-center gap-4 px-8 py-3 text-on-surface-variant transition-transform duration-300 hover:translate-x-1 focus:outline-2 focus:outline-primary"
            tabIndex={0}
            aria-label="Profil"
          >
            <User size={18} aria-hidden="true" role="img" focusable="false" />
            <span className="text-sm">Profil</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-4 px-8 py-3 text-on-surface-variant transition-transform duration-300 hover:translate-x-1 focus:outline-2 focus:outline-primary"
            tabIndex={0}
            aria-label="Archives"
          >
            <Archive size={18} aria-hidden="true" role="img" focusable="false" />
            <span className="text-sm">Archives</span>
          </Link>
        </nav>
      </aside>

      <section className="min-w-0 flex-1 bg-[#f8fafc]">
        {/* Barre superieure contenu */}
        <header className="sticky top-16 z-30 w-full bg-surface">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">
              Mes tâches
            </h2>
            <div className="flex items-center gap-4">
              <button
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container focus:outline-2 focus:outline-primary"
                type="button"
                aria-label="Afficher le calendrier"
              >
                <Calendar size={20} aria-hidden="true" role="img" focusable="false" />
              </button>
              <button
                className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container focus:outline-2 focus:outline-primary"
                type="button"
                aria-label="Afficher les notifications"
              >
                <Bell size={20} aria-hidden="true" role="img" focusable="false" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tertiary" />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
          {/* Dashboard statistiques */}
          <Dashboard tasks={tasks} />
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-4xl font-extrabold tracking-tight text-on-surface">
                Mes Tâches
              </h3>
              <p className="mt-2 text-lg text-on-surface-variant">
                Organisez votre flux de travail architectural.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Le composant SearchBar DOIT contenir un label accessible (modifier son code si besoin).
                  On suppose qu’un label "Recherche de tâche" y est fourni. */}
              <SearchBar value={searchQuery} onChange={setSearchQuery} label="Recherche de tâche" />

              <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-2 py-1 text-on-surface-variant">
                {/* Icon décoratif, non pertinent pour l’accessibilité */}
                <Filter size={18} aria-hidden="true" role="img" focusable="false" />
                <label htmlFor="status-filter" className="text-sm">
                  Statut&nbsp;:
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cursor-pointer rounded-md bg-transparent px-2 py-1 text-sm focus:outline-2 focus:outline-primary"
                  aria-label="Filtrer par statut"
                >
                  <option value="all">Tous statuts</option>
                  <option value="active">Actives</option>
                  <option value="completed">Complétées</option>
                </select>
              </div>
              <div className="rounded-lg bg-surface-container-high px-2 py-1 text-on-surface-variant flex items-center gap-2">
                <label htmlFor="priority-sort" className="text-sm">
                  Priorité&nbsp;:
                </label>
                <select
                  id="priority-sort"
                  value={prioritySort}
                  onChange={(e) => setPrioritySort(e.target.value)}
                  className="cursor-pointer rounded-md bg-transparent px-2 py-1 text-sm focus:outline-2 focus:outline-primary"
                  aria-label="Trier par priorité"
                >
                  <option value="none">Sans tri</option>
                  <option value="highToLow">Priorité décroissante</option>
                  <option value="lowToHigh">Priorité croissante</option>
                </select>
              </div>
            </div>
          </header>

          {/* AddTaskForm DOIT fournir un label visible ou sr-only pour tous ses champs */}
          <AddTaskForm onAddTask={handleAddTask} />

          {/* TaskList et ses éléments interactifs doivent être accessibles (boutons avec aria-label, etc.) */}
          <TaskList
            taskItems={finalTasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleRequestDeleteTask}
          />
        </div>
      </section>

          {/* Navigation mobile flottante */}
          <nav
            className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center justify-between rounded-full border border-white/20 bg-white/90 px-6 py-2 shadow-[0px_20px_40px_rgba(25,27,35,0.08)] backdrop-blur-xl md:hidden"
            aria-label="Navigation mobile principale"
          >
            <a
              href="#"
              aria-label="Voir les tâches"
              className="flex flex-col items-center rounded-full bg-linear-to-r from-[#003d9b] to-[#0052cc] px-4 py-1 text-white focus:outline-2 focus:outline-primary"
              tabIndex={0}
            >
              <ListChecks size={18} aria-hidden="true" role="img" focusable="false" />
              <span className="text-[10px] uppercase tracking-widest">Tâches</span>
            </a>
            <a
              href="#"
              aria-label="Recherche"
              className="ml-4 flex flex-col items-center text-on-surface-variant transition-all hover:opacity-80 focus:outline-2 focus:outline-primary"
              tabIndex={0}
            >
              <Search size={18} aria-hidden="true" role="img" focusable="false" />
              <span className="text-[10px] uppercase tracking-widest">Recherche</span>
            </a>
            <a
              href="#"
              aria-label="Paramètres"
              className="ml-4 flex flex-col items-center text-on-surface-variant transition-all hover:opacity-80 focus:outline-2 focus:outline-primary"
              tabIndex={0}
            >
              <Settings size={18} aria-hidden="true" role="img" focusable="false" />
              <span className="text-[10px] uppercase tracking-widest">Paramètres</span>
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
              Supprimer cette tâche&nbsp;?
            </h4>
            <p className="mt-2 text-sm text-zinc-700">
              Cette action est irréversible. Voulez-vous continuer&nbsp;?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDeleteTask}
                className="rounded-lg border border-zinc-400 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 focus:outline-2 focus:outline-primary cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTask}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 focus:outline-2 focus:outline-primary cursor-pointer"
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
            <form
              onSubmit={e => {
                e.preventDefault();
                handleConfirmEditTask();
              }}
              className="mt-4"
              aria-label="Formulaire d’édition de tâche"
            >
              <label htmlFor="edit-task-title" className="block text-sm text-zinc-700">
                Nouveau titre&nbsp;:
              </label>
              <input
                id="edit-task-title"
                type="text"
                value={draftTaskTitle}
                onChange={(event) => setDraftTaskTitle(event.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-400 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="Saisissez un titre"
                autoFocus
                aria-required="true"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEditTask}
                  className="rounded-lg border border-zinc-400 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 focus:outline-2 focus:outline-primary cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-2 focus:outline-primary cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
