"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  subscribeToTasks,
  addTask,
  updateTask,
  deleteTask,
} from "@/services/rtdbTaskService";
import { useMemo } from "react";
import { Filter, ListChecks, User, Archive } from "lucide-react";
import AddTaskForm from "../../components/AddTaskForm";
import TaskList from "../../components/TaskList";

export default function TachesPage() {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("toutes");
  const [statusFilter, setStatusFilter] = useState("toutes");
  const [sortMode, setSortMode] = useState("recent");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState(null);
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1, medium: 2 };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    // Synchronisation Firestore temps réel des tâches de l'utilisateur
    if (!user) {
      setTasks([]);
      return;
    }
    setTasksLoading(true);
    setError("");
    // On écoute la collection users/${user.uid}/tasks
    const unsubscribe = subscribeToTasks(user.uid, (tasks, errMsg) => {
      if (errMsg) {
        setError(errMsg);
        setTasks([]);
        setTasksLoading(false);
        console.error("Erreur Firestore:", errMsg);
        return;
      }
      setTasks(tasks);
      setTasksLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Tous les hooks doivent être déclarés AVANT tout return ou logique conditionnelle
  const handleAddTask = useCallback(
    async ({ title, priority }) => {
      if (!user?.uid) {
        setError("Utilisateur non authentifié : impossible d'ajouter la tâche.");
        console.error("[handleAddTask] user.uid absent, tâche non ajoutée");
        return;
      }
      setError("");
      try {
        await addTask(user.uid, { title, priority });
      } catch (err) {
        setError("Erreur Firestore : " + (err?.message || err));
        console.error("[handleAddTask] Erreur Firestore:", err);
      }
    },
    [user]
  );

  const handleToggleTask = useCallback(
    async (targetTaskId) => {
      if (!user?.uid) return;
      setError("");
      try {
        const task = tasks.find((t) => t.id === targetTaskId);
        if (!task) return;
        await updateTask(user.uid, task.id, { completed: !task.completed });
      } catch (err) {
        setError(err.message);
      }
    },
    [user, tasks]
  );

  const handleDeleteTask = useCallback(
    async (targetTaskId) => {
      if (!user?.uid) return;
      setError("");
      try {
        await deleteTask(user.uid, targetTaskId);
      } catch (err) {
        setError(err.message);
      }
    },
    [user]
  );

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

  const handleConfirmEditTask = async () => {
    if (!user?.uid) return;
    const nextTitle = draftTaskTitle.trim();
    if (!nextTitle || editingTaskId == null) return;
    setError("");
    try {
      await updateTask(user.uid, editingTaskId, { title: nextTitle });
      handleCancelEditTask();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRequestDeleteTask = (targetTaskId) => {
    setPendingDeleteTaskId(targetTaskId);
  };

  const handleCancelDeleteTask = () => {
    setPendingDeleteTaskId(null);
  };

  const handleConfirmDeleteTask = async () => {
    if (pendingDeleteTaskId == null) return;
    await handleDeleteTask(pendingDeleteTaskId);
    setPendingDeleteTaskId(null);
  };

  const totalTasks = tasks.length;

  // Construit la liste visible avec filtre et tri
  const visibleTaskItems = useMemo(() => {
    const filteredTasks = tasks.filter((taskItem) => {
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
      return (taskB.createdAt?.seconds || 0) - (taskA.createdAt?.seconds || 0);
    });
  }, [tasks, priorityFilter, statusFilter, sortMode]);

  if (loading || tasksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-on-surface-variant bg-surface">
        Chargement...
      </div>
    );
  }

  if (!user) {
    // On laisse la redirection faire son effet, on n'affiche rien
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900">Tâches</h1>
          <p className="mt-1 text-zinc-600">
            Retrouvez vos tâches du jour ({totalTasks} au total).
          </p>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-error-container text-error rounded-lg font-medium">
            {error}
          </div>
        )}

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
                <option value="recent">Plus récent</option>
                <option value="priority_desc">Priorité haute → basse</option>
                <option value="priority_asc">Priorité basse → haute</option>
                <option value="title_asc">Titre A → Z</option>
                <option value="title_desc">Titre Z → A</option>
              </select>
            </div>
          </div>

          <TaskList
            tasks={visibleTaskItems}
            onToggle={handleToggleTask}
            onEdit={handleEditTask}
            onDelete={handleRequestDeleteTask}
            editingTaskId={editingTaskId}
            draftTaskTitle={draftTaskTitle}
            onDraftChange={setDraftTaskTitle}
            onEditCancel={handleCancelEditTask}
            onEditConfirm={handleConfirmEditTask}
            pendingDeleteTaskId={pendingDeleteTaskId}
            onDeleteCancel={handleCancelDeleteTask}
            onDeleteConfirm={handleConfirmDeleteTask}
          />
        </section>
      </section>
    </main>
  );
}
