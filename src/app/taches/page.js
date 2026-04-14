"use client";
// Lance l'édition d'une tâche (ouvre la modale d'édition)
  const handleEditTask = (targetTaskId) => {
    const targetTask = taskItems.find((task) => task.id === targetTaskId);
    if (!targetTask) return;
    setEditingTaskId(targetTaskId);
    setDraftTaskTitle(targetTask.title);
  };

import { useMemo, useState } from "react";
import { Filter, ListChecks, User, Archive } from "lucide-react";
import AddTaskForm from "../../components/AddTaskForm";
import TaskList from "../../components/TaskList";

// Données de test initiales pour la page tâches
const initialTaskItems = [
  {
    id: 1,
    title: "Préparer la réunion produit",
    description: "Rassembler les points clés du sprint",
    priority: "haute",
    completed: false,
  },
  {
    id: 2,
    title: "Réviser les tickets en cours",
    description: "Valider les priorités avec l'équipe",
    priority: "moyenne",
    completed: false,
  },
  {
    id: 3,
    title: "Envoyer le compte-rendu",
    description: "Partager le document à toute l'équipe",
    priority: "basse",
    completed: true,
  },
];

export default function TachesPage() {
  const [taskItems, setTaskItems] = useState(initialTaskItems);
  const [priorityFilter, setPriorityFilter] = useState("toutes");
  const [statusFilter, setStatusFilter] = useState("toutes");
  const [sortMode, setSortMode] = useState("recent");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState(null);
  const totalTasks = taskItems.length;
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1 };

  // Construit la liste visible avec filtre et tri
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

  // Bascule l'état completed d'une tâche
  const handleToggleTask = (targetTaskId) => {
    setTaskItems((currentTaskItems) =>
      currentTaskItems.map((taskItem) =>
        taskItem.id === targetTaskId
          ? { ...taskItem, completed: !taskItem.completed }
          : taskItem
      )
    );
  };

  // Supprime la tâche ciblée du tableau
  const handleDeleteTask = (targetTaskId) => {
    setTaskItems((currentTaskItems) =>
      currentTaskItems.filter((taskItem) => taskItem.id !== targetTaskId)
    );
  };

  // Ajoute une nouvelle tache
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
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900">Tâches</h1>
          <p className="mt-1 text-zinc-600">
            Retrouvez vos tâches du jour ({totalTasks} au total).
          </p>
        </header>

        {/* Liste des tâches affichée via TaskList */}
        <section aria-label="Liste des tâches" role="list">
          <AddTaskForm onAddTask={handleAddTask} />
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-2 py-1 text-on-surface-variant">
              <Filter size={18} aria-hidden="true" />
              <label htmlFor="priority-filter-taches" className="sr-only">
                Filtrer par priorité
              </label>
              <select
                id="priority-filter-taches"
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
              <label htmlFor="status-filter-taches" className="sr-only">
                Filtrer par statut
              </label>
              <select
                id="status-filter-taches"
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
              <label htmlFor="sort-mode-taches" className="sr-only">
                Mode de tri
              </label>
              <select
                id="sort-mode-taches"
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
          <TaskList
            taskItems={visibleTaskItems}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleRequestDeleteTask}
          />
        </section>
      </section>

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
