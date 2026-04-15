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

// Rappel : la balise <html lang=\"fr\"> est à intégrer dans le fichier racine _document.js ou layout.js de Next.js pour application globale.



export default function Home() {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  // Tous les hooks d'état doivent être déclarés AVANT toute logique conditionnelle
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [prioritySort, setPrioritySort] = useState("none");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState(null);
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1, medium: 2 };
  const userId = user?.uid;

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
      if (!userId) return;
      setError("");
      try {
        const task = tasks.find((t) => t.id === targetTaskId);
        if (!task) return;
        await updateTask(userId, task.id, { completed: !task.completed });
      } catch (err) {
        setError(err.message);
      }
    },
    [userId, tasks]
  );

  const handleDeleteTask = useCallback(
    async (targetTaskId) => {
      if (!userId) return;
      setError("");
      try {
        await deleteTask(userId, targetTaskId);
      } catch (err) {
        setError(err.message);
      }
    },
    [userId]
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
    if (!userId) return;
    const nextTitle = draftTaskTitle.trim();
    if (!nextTitle || editingTaskId == null) return;
    setError("");
    try {
      await updateTask(userId, editingTaskId, { title: nextTitle });
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
    <main className="min-h-screen bg-surface text-on-surface md:flex flex-col" tabIndex={-1}>
      <div className="w-full flex justify-end items-center gap-4 px-8 py-4 bg-surface-container-high border-b border-outline-variant/10">
        <span className="text-sm text-on-surface-variant">Connecté en tant que : <span className="font-semibold text-primary">{user.email}</span></span>
        <button
          onClick={logOut}
          className="ml-2 px-4 py-2 rounded-lg bg-error-container text-on-error-container font-semibold hover:bg-error-container/80 transition-all"
        >
          Déconnexion
        </button>
      </div>
      <div className="flex-1 flex flex-col p-6 gap-6">
        {error && (
          <div className="p-4 bg-error-container text-error rounded-lg font-medium">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-on-surface">Mes Tâches</h1>
          <p className="text-on-surface-variant">Gérez votre liste de tâches en temps réel.</p>
        </div>
        <AddTaskForm onAddTask={handleAddTask} />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="all">Toutes</option>
              <option value="active">En cours</option>
              <option value="completed">Complétées</option>
            </select>
            <select
              value={prioritySort}
              onChange={(e) => setPrioritySort(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="none">Sans tri</option>
              <option value="highToLow">Priorité haute → basse</option>
              <option value="lowToHigh">Priorité basse → haute</option>
            </select>
          </div>
        </div>
        <TaskList
          tasks={finalTasks}
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
      </div>
    </main>
  );
}
