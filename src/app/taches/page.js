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
import { Filter, ListChecks, User, Archive, CheckCircle2, X, Trash2, Plus, Search, ArrowUp, ArrowDown } from "lucide-react";
import AddTaskForm from "../../components/AddTaskForm";
import TaskList from "../../components/TaskList";
import SearchBar from "../../components/SearchBar";

export default function TachesPage() {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("toutes");
  const [statusFilter, setStatusFilter] = useState("toutes");
  const [sortMode, setSortMode] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleReorderTasks = useCallback(
    (reorderedTasks) => {
      setTasks(reorderedTasks);
    },
    []
  );

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
      const matchesSearch = searchQuery === "" || 
        taskItem.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPriority && matchesStatus && matchesSearch;
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
  }, [tasks, priorityFilter, statusFilter, sortMode, searchQuery]);

  if (loading || tasksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-on-surface-variant bg-background">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Main Content: Grand Livre des Quêtes */}
      <div className="flex flex-col items-center justify-center p-4 md:p-12 overflow-y-auto parchment-texture  custom-scroll">
        <div className="relative w-full max-w-4xl min-h-217.5 p-8 md:p-16 flex flex-col">
          {/* Header Structural Rivets */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-outline-variant opacity-40"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-outline-variant opacity-40"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-outline-variant opacity-40"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-outline-variant opacity-40"></div>
            {/* Title Section */}
            <div className="text-center mb-10">
              <h1 className="font-headline text-4xl md:text-5xl text-[#2b2824] mb-2">Registre des Contrats Personnels</h1>
              <div className="h-1 w-full bg-[#2b2824] mb-1"></div>
              <div className="h-0.5 w-full bg-[#c28e46]"></div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="flex items-center gap-2 bg-[#2b2824] border-2 border-[#c2b59b] px-4 py-2">
                <Search size={20} className="text-[#c28e46]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une tâche..."
                  className="flex-1 bg-transparent text-[#e3d5b8] placeholder-[#8a8171] focus:outline-none font-body"
                />
              </div>
            </div>

            {/* Filters: Leather Bookmarks */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="flex gap-2">
                <button className={`px-6 py-2 font-label text-xs font-bold uppercase tracking-widest shadow-lg transition-opacity ${statusFilter === "toutes" ? "bg-[#24211d] text-[#e3d5b8]" : "bg-[#3d362d] text-[#e3d5b8] opacity-80 hover:opacity-100"}`} onClick={() => setStatusFilter("toutes")}>
                  Toutes
                </button>
                <button className={`px-6 py-2 font-label text-xs font-bold uppercase tracking-widest shadow-lg transition-opacity ${statusFilter === "actives" ? "bg-[#24211d] text-[#e3d5b8]" : "bg-[#3d362d] text-[#e3d5b8] opacity-80 hover:opacity-100"}`} onClick={() => setStatusFilter("actives")}>
                  En Cours (Actives)
                </button>
                <button className={`px-6 py-2 font-label text-xs font-bold uppercase tracking-widest shadow-lg transition-opacity ${statusFilter === "completees" ? "bg-[#24211d] text-[#e3d5b8]" : "bg-[#3d362d] text-[#e3d5b8] opacity-80 hover:opacity-100"}`} onClick={() => setStatusFilter("completees")}>
                  Accomplies (Terminées)
                </button>
              </div>

              {/* Sort Buttons */}
              <div className="flex gap-2 ml-auto">
                <button 
                  className={`flex items-center gap-1 px-4 py-2 font-label text-xs font-bold uppercase tracking-widest shadow-lg transition-opacity ${sortMode === "priority_asc" ? "bg-[#24211d] text-[#e3d5b8]" : "bg-[#3d362d] text-[#e3d5b8] opacity-80 hover:opacity-100"}`}
                  onClick={() => setSortMode("priority_asc")}
                  title="Trier par priorité croissante (basse → haute)"
                >
                  <ArrowUp size={14} />
                  Priorité
                </button>
                <button 
                  className={`flex items-center gap-1 px-4 py-2 font-label text-xs font-bold uppercase tracking-widest shadow-lg transition-opacity ${sortMode === "priority_desc" ? "bg-[#24211d] text-[#e3d5b8]" : "bg-[#3d362d] text-[#e3d5b8] opacity-80 hover:opacity-100"}`}
                  onClick={() => setSortMode("priority_desc")}
                  title="Trier par priorité décroissante (haute → basse)"
                >
                  <ArrowDown size={14} />
                  Priorité
                </button>
              </div>
            </div>
            {/* Quest Lines */}
            <div className="flex-1 space-y-2">
              <TaskList
                tasks={visibleTaskItems}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onReorder={handleReorderTasks}
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
            {/* Footer Sign-off */}
            <div className="mt-12 flex justify-between items-end">
              <div className="font-headline text-[#5c564c] opacity-60 italic">
                "Par le sceau de la Guilde, que votre lame ne s'émousse jamais."
              </div>
              <div className="text-right">
                <p className="font-label text-[10px] text-[#2b2824] uppercase font-bold tracking-[0.2em]">Authentifié par</p>
                <p className="font-headline text-2xl text-[#2b2824]">L'Intendance</p>
              </div>
            </div>
        </div>
        </div>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="fixed bottom-24 md:bottom-8 right-8 bg-[#c28e46] text-[#151310] p-4 rounded-full shadow-2xl hover:bg-[#e8b879] transition-colors z-40 flex items-center justify-center"
        title="Ajouter une nouvelle tâche"
        aria-label="Ajouter une tâche"
      >
        <Plus size={28} />
      </button>

      {/* Mobile Navigation (Footer) */}
      <footer className="md:hidden fixed bottom-0 w-full bg-[#151310] flex justify-around py-3 border-t border-[#3a352e] z-50">
        <button className="flex flex-col items-center text-[#c28e46]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>assignment</span>
          <span className="text-[10px] font-label uppercase">Quêtes</span>
        </button>
        <button className="flex flex-col items-center text-[#8a8171]">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-label uppercase">Cartes</span>
        </button>
        <button className="flex flex-col items-center text-[#8a8171]">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-[10px] font-label uppercase">Notes</span>
        </button>
      </footer>

      {/* Modal AddTaskForm */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-[#e3d5b8] parchment-texture p-8 shadow-2xl max-w-lg w-full relative border border-[#c2b59b]">
            <button
              className="absolute top-4 right-4 text-[#2b2824] hover:text-[#93000a] transition-colors"
              onClick={() => setShowAddForm(false)}
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
            <h2 className="font-headline text-2xl text-[#2b2824] mb-6">Nouvelle Mission</h2>
            <AddTaskForm onAddTask={async (taskData) => {
              await handleAddTask(taskData);
              setShowAddForm(false);
            }} />
          </div>
        </div>
      )}
    </>
  );
}
