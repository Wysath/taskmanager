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
  Clock,
  BookOpen,
  Star,
  Zap,
  Lock,
  SquarePen,
  X,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Info,
  FileText,
  Swords,
} from "lucide-react";
import Link from "next/link";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";
import Dashboard from "../components/Dashboard";

// Rappel : la balise <html lang=\"fr\"> est à intégrer dans le fichier racine _document.js ou layout.js de Next.js pour application globale.



export default function Home() {
  // --- LOGIQUE SANCTUARISÉE ---
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const priorityOrder = { haute: 3, moyenne: 2, basse: 1, medium: 2 };
  const userId = user?.uid;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    setTasksLoading(true);
    setError("");
    const unsubscribe = subscribeToTasks(user.uid, (tasks, errMsg) => {
      if (errMsg) {
        setError(errMsg);
        setTasks([]);
        setTasksLoading(false);
        return;
      }
      setTasks(tasks);
      setTasksLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTask = useCallback(
    async ({ title, priority }) => {
      if (!user?.uid) {
        setError("Utilisateur non authentifié : impossible d'ajouter la tâche.");
        return;
      }
      setError("");
      try {
        await addTask(user.uid, { title, priority });
      } catch (err) {
        setError("Erreur Firestore : " + (err?.message || err));
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

  // --- UI ADAPTÉE DESIGN MONSTER HUNTER ---
  if (loading || tasksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-on-surface-variant bg-surface">
        Chargement...
      </div>
    );
  }
  if (!user) return null;

  // Filtrage simple sur le searchQuery
  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return task.title.toLowerCase().includes(q) || (task.description && task.description.toLowerCase().includes(q));
  });

  return (
    <>
      {/* Overlay grain Monster Hunter */}
      <div className="fixed inset-0 grain-overlay z-50 pointer-events-none" />
      {/* Main Canvas */}
      <div className="min-h-screen relative">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-8 py-4 bg-[#151310] border-b-2 border-[#3a352e] sticky top-0 z-30">
          <div className="flex flex-col">
            <h1 className="font-headline uppercase tracking-widest text-xl font-bold text-[#e8e1dc]">CHASSEUR : {user.displayName || user.email || "-"}</h1>
            {/* Endurance Bar (Objectives) */}
            <div className="mt-2 w-64">
              <div className="flex justify-between items-end mb-1">
                <span className="font-label text-[9px] text-[#c28e46] tracking-tighter uppercase font-bold">OBJECTIFS DU JOUR</span>
                <span className="font-label text-[9px] text-[#c28e46]">{tasks.length > 0 ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` : "0%"}</span>
              </div>
              <div className="h-1.5 w-full bg-[#2c2a26] border border-[#504538] p-[1px]">
                <div className="h-full bg-gradient-to-r from-[#c28e46] to-[#e8b879]" style={{ width: tasks.length > 0 ? `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button 
                className="text-[#8a8171] hover:text-[#e8e1dc] transition-colors hover:bg-[#2c2a26] p-2"
                title="Historique"
                aria-label="Historique des tâches"
              >
                <Clock size={20} />
              </button>
              <button 
                className="text-[#8a8171] hover:text-[#e8e1dc] transition-colors hover:bg-[#2c2a26] p-2"
                title="Paramètres"
                aria-label="Paramètres"
              >
                <Settings size={20} />
              </button>
            </div>
            <div className="w-10 h-10 border border-[#504538] p-0.5">
              <img alt="Avatar" className="w-full h-full object-cover grayscale brightness-75" src={user.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAMnqWGcAtdENwOaWjqpWQ7mYcDYcxvC8iIpd9IDVdM9ECL32YymA7eidgvZKCaXMqUGMj4evLbRwj_xUfbkVRQLz0KE3GAjbAChJXConyZ8SUqkIqHx07WDtYI-WKGTvgqHmr6ye4atZT_MHh6dfaOB7sGP4G0k85hH8mRJ9g9ajhdaT2xvrjuMSdABk9gCjN2raAr7yyCvvZQyjsjljvEtwcWHllGkNZ7yYQ0zLB_KZ7ekkg3BPqq8oF_RTcy0nTIFHgeV2kUHl4"} />
            </div>
          </div>
        </header>
        {/* Content Area */}
        <section className="p-8 max-w-6xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-headline text-5xl font-extrabold uppercase tracking-tighter text-[#e8e1dc]">TABLEAU DES MISSIONS</h2>
              <p className="font-body text-[#8a8171] mt-2 text-sm max-w-md italic">Consultez les contrats disponibles et préparez votre équipement pour les Terres Interdites.</p>
            </div>
            {/* SearchBar Monster Hunter */}
            <div className="relative group">
              <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c28e46]" />
              <input
                className="bg-[#2c2a26] border-b-2 border-[#c28e46] text-[#e3d5b8] text-xs font-label tracking-widest pl-10 pr-4 py-3 focus:ring-0 focus:outline-none w-64 transition-all placeholder-[#8a8171]"
                placeholder="RECHERCHER DANS LE REGISTRE..."
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Task Grid dynamique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTasks.length === 0 && (
              <div className="col-span-2 text-center text-[#8a8171] italic py-8">Aucune mission trouvée.</div>
            )}
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="parchment-texture bg-[#e3d5b8] border-4 border-[#c2b59b] relative p-6 group hover:shadow-xl transition-shadow"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#c28e46]"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-label text-[10px] text-[#2b2824] font-bold tracking-widest bg-[#c28e46] px-2 py-0.5 border border-[#2b2824] uppercase">Mission</span>
                    <h3 className="font-headline text-2xl font-bold text-[#2b2824] mt-2">{task.title}</h3>
                  </div>
                  <div className="text-[#c28e46] flex">
                    {[...Array(priorityOrder[task.priority] || 2)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                    {[...Array(5 - (priorityOrder[task.priority] || 2))].map((_, i) => (
                      <Star key={i} size={14} />
                    ))}
                  </div>
                </div>
                <p className="font-body text-[#5c564c] text-sm mb-6 leading-relaxed">
                  {task.description || "Aucune description."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-[#5c564c]">
                    <Zap size={16} />
                    <span className="font-label text-[10px] font-bold uppercase tracking-wider">Zone inconnue</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-[#c28e46] text-[#151310] px-6 py-2 font-headline font-bold text-xs uppercase tracking-widest hover:bg-[#e8b879] transition-colors border border-[#c28e46] flex items-center gap-2"
                      onClick={() => handleToggleTask(task.id)}
                      title={task.completed ? "Marquer comme incomplète" : "Marquer comme complète"}
                      aria-label={task.completed ? "Annuler la mission" : "Partir en chasse"}
                    >
                      {task.completed ? <><CheckCircle2 size={16} /> RÉUSSI</> : <>PARTIR EN CHASSE</> }
                    </button>
                    <button
                      className="ml-2 bg-[#93000a] text-[#e3d5b8] px-4 py-2 font-headline font-bold text-xs uppercase tracking-widest hover:bg-[#c21e1e] transition-colors border border-[#93000a] flex items-center gap-2"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Retirer la mission"
                      aria-label="Supprimer la mission"
                    >
                      <Trash2 size={14} /> ABANDONNER
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Slot vide pour nouvelle mission (verrou) */}
            <div className="border-4 border-dashed border-[#504538] flex flex-col items-center justify-center p-6 bg-[#1a1816] min-h-[220px]">
              <Lock size={48} className="text-[#504538] mb-4" />
              <p className="font-label text-xs text-[#8a8171] tracking-widest uppercase text-center">Contrat de guilde scellé<br /><span className="text-[10px] opacity-60">Requis : Rang de Chasseur 5</span></p>
            </div>
          </div>
        </section>
        {/* Floating Action Button pour afficher AddTaskForm */}
        <button
          className="fixed bottom-8 right-8 bg-[#c28e46] text-[#151310] flex items-center gap-3 px-6 py-4 shadow-2xl hover:bg-[#e8b879] active:scale-95 transition-all z-50 font-headline font-bold uppercase text-xs tracking-widest border border-[#c28e46]"
          onClick={() => setShowAddForm((v) => !v)}
          title="Publier un nouveau contrat"
          aria-label="Publier un contrat"
        >
          <SquarePen size={18} />
          <span>PUBLIER UN CONTRAT</span>
        </button>
        {/* Modal AddTaskForm */}
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
            <div className="bg-white p-0 shadow-2xl max-w-2xl w-full relative rounded-lg overflow-hidden">
              {/* Header Dark avec Icon */}
              <div className="bg-gradient-to-r from-[#151310] to-[#2c2a26] px-8 py-6 flex items-center justify-between border-b-4 border-[#c28e46]">
                <div className="flex items-center gap-4">
                  <div className="bg-[#c28e46] p-3 rounded flex items-center justify-center">
                    <Swords size={24} className="text-[#151310]" />
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl text-white uppercase tracking-widest">Nouveau Contrat</h2>
                    <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider">Créez une nouvelle quête à accomplir</p>
                  </div>
                </div>
                <button
                  className="text-white hover:bg-[#3a3835] p-2 rounded transition-colors"
                  onClick={() => setShowAddForm(false)}
                  aria-label="Fermer le formulaire"
                  title="Fermer"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-8">
                {/* Info Hint */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 flex gap-3">
                  <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Conseils pour créer une quête</p>
                    <p className="text-blue-700 text-xs mt-1">Donnez un titre clair, sélectionnez la priorité appropriée et lancez votre contrat!</p>
                  </div>
                </div>
                
                <AddTaskForm onAddTask={async (taskData) => {
                  await handleAddTask(taskData);
                  setShowAddForm(false);
                }} />
              </div>
            </div>
          </div>
        )}
        {/* Background Map Tint Decor */}
        <div className="absolute inset-0 -z-10 opacity-[0.02] overflow-hidden pointer-events-none">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7ktFiPdNCagqwnJ6SGBvBHgA0KIy7WMxq9KbXSrQdvH0s7oDvlZrd6WifkpXqxkrUSahZ863UGDlrhrzbshDArReFC6mBXRqF_DQMv8NHDWeIalHPEV5AbKGw88Cn16RWrN4e_IpIum473oIigpp4PVqjCGOwOyyUzZ7xAdBPM2dLPVCtouE4zeyfhDH2xx7RgUi_wE31MJoGZlnNv5-jajRCWJ7zJRDSK4fwYn1En-2XTgmn1FP35VhP65zx4kp60qn_uljOfOQ" alt="Carte" />
        </div>
      </div>
    </>
  );
}
