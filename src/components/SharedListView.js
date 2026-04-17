"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import AddTaskForm from "./AddTaskForm";
import {
  User,
  Trash2,
  ArrowLeft,
  Plus,
  Users,
  Shield,
  CheckCircle2,
  Sword,
  Crown,
  AlertCircle,
  LogOut,
  X,
} from "lucide-react";

export default function SharedListView({
  list,
  tasks = [],
  currentUserId,
  currentUserEmail,
  members = [],
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onBack,
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [memberToLeave, setMemberToLeave] = useState(false);
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);

  // Calcule le nombre de membres avec email (optimisé avec useMemo)
  const membersWithEmail = useMemo(
    () => members.filter((m) => !!m.email),
    [members]
  );

  // Calcule le rôle de l'utilisateur courant
  const currentUserRole = useMemo(() => {
    return (
      members.find(
        (m) =>
          m.email?.toLowerCase() === currentUserEmail?.toLowerCase()
      )?.role || "viewer"
    );
  }, [members, currentUserEmail]);

  const isAdmin = currentUserRole === "admin";
  const isEditor = currentUserRole === "editor" || isAdmin;
  const canAddTasks = isEditor;

  // Trie éventuellement les tâches si besoin, ici simple copie (optimisation possible)
  const displayedTasks = useMemo(() => tasks.slice(), [tasks]);

  // Handlers délégués, optimisés avec useCallback pour éviter les re-créations inutiles
  const handleInvite = useCallback(
    async (e) => {
      e.preventDefault();
      setInviteError("");
      const emailTrim = inviteEmail.trim();
      if (!emailTrim) {
        setInviteError("Veuillez entrer une adresse e-mail valide.");
        return;
      }
      // Validation simple de l'email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        setInviteError("L'adresse e-mail n'est pas valide.");
        return;
      }
      setInviteLoading(true);
      try {
        await onAddMember?.(emailTrim);
        setInviteEmail("");
      } catch (err) {
        // Les toasts sont gérés par le callback parent
        setInviteError("Impossible d'inviter ce membre. Vérifiez l'adresse e-mail.");
      } finally {
        setInviteLoading(false);
      }
    },
    [inviteEmail, onAddMember]
  );

  const handleRemoveMember = useCallback(
    (email) => {
      // ✅ Demander confirmation avant de supprimer
      setMemberToRemove(email);
    },
    []
  );

  const handleConfirmRemove = useCallback(
    async () => {
      if (!memberToRemove) return;
      try {
        await onRemoveMember?.(memberToRemove);
        setMemberToRemove(null);  // Fermer la modale
      } catch (err) {
        console.error("Erreur suppression membre:", err);
      }
    },
    [memberToRemove, onRemoveMember]
  );

  const handleCancelRemove = useCallback(() => {
    setMemberToRemove(null);
  }, []);

  const handleConfirmLeave = useCallback(async () => {
    if (!currentUserEmail) return;
    try {
      await onRemoveMember?.(currentUserEmail);
      setMemberToLeave(false);
      onBack?.();
    } catch (err) {
      console.error("Erreur quitter escouade:", err);
    }
  }, [currentUserEmail, onRemoveMember, onBack]);

  const handleCancelLeave = useCallback(() => {
    setMemberToLeave(false);
  }, []);

  const handleRoleChange = useCallback(
    async (memberEmail, newRole) => {
      setRoleChangeLoading(true);
      try {
        await onUpdateMemberRole?.(memberEmail, newRole);
      } catch (err) {
        console.error("Erreur changement rôle:", err);
      } finally {
        setRoleChangeLoading(false);
      }
    },
    [onUpdateMemberRole]
  );

  const handleUpdateTask = useCallback(
    (taskId, data) => {
      onUpdateTask?.(taskId, data);
    },
    [onUpdateTask]
  );

  const handleDeleteTask = useCallback(
    (taskId) => {
      onDeleteTask?.(taskId);
    },
    [onDeleteTask]
  );

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  const handleShowAddTask = useCallback(() => {
    setShowAddTask((v) => !v);
  }, []);

  const handleAddTask = useCallback(
    async (taskData) => {
      await onAddTask(taskData);
      setShowAddTask(false);
    },
    [onAddTask]
  );

  return (
    <section className="w-full">
      {/* Header */}
      <div className="bg-[#211f1c] border-b-4 border-[#504538] p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#3a3835] transition-colors text-[#c28e46]"
            aria-label="Retour"
            title="Retour aux escouades"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-headline text-[#e8e1dc] uppercase tracking-widest">
              {list.name}
            </h1>
            <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider mt-1">
              Escouade partagée • {membersWithEmail.length} Chasseur{membersWithEmail.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        
        {!isAdmin && (
          <button
            onClick={() => setMemberToLeave(true)}
            className="flex items-center gap-2 px-4 py-2 text-[#8a8171] hover:text-[#93000a] hover:bg-[#3a3835] rounded transition-colors font-label text-xs uppercase tracking-wider"
            title="Quitter cette escouade"
          >
            <LogOut size={16} />
            Quitter
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-6xl">
        {/* Members Section */}
        <div className="mb-12">
          <h2 className="font-headline text-2xl text-[#c28e46] mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Users size={24} />
            Compagnons ({membersWithEmail.length})
          </h2>

          {/* Members List */}
          <div className="bg-[#211f1c] border-2 border-[#504538] rounded-lg overflow-hidden">
            {membersWithEmail.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[#8a8171] font-body italic">Aucun membre pour le moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#504538]">
                {membersWithEmail.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between p-4 hover:bg-[#2c2a26] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-[#c28e46] flex items-center justify-center text-[#151310] font-bold rounded text-sm flex-shrink-0">
                        {member.email?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[#e8e1dc] font-body truncate">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {member.role === "admin" && (
                            <span className="text-[#c28e46] font-label text-xs uppercase tracking-wider flex items-center gap-1 bg-[#c28e46]/10 px-2 py-1 rounded">
                              <Crown size={12} /> Chef
                            </span>
                          )}
                          {member.role === "editor" && (
                            <span className="text-[#c28e46] font-label text-xs uppercase tracking-wider flex items-center gap-1 bg-[#c28e46]/10 px-2 py-1 rounded">
                              <Shield size={12} /> Éditeur
                            </span>
                          )}
                          {member.role === "viewer" && (
                            <span className="text-[#8a8171] font-label text-xs uppercase tracking-wider flex items-center gap-1 bg-[#504538]/50 px-2 py-1 rounded">
                              <User size={12} /> Lecteur
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    {isAdmin && member.role !== "admin" && (
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {member.role !== "admin" && (
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.email, e.target.value)}
                            disabled={roleChangeLoading}
                            className="text-[#e3d5b8] font-label text-xs uppercase tracking-wider bg-[#2c2a26] border border-[#504538] px-3 py-2 rounded cursor-pointer hover:border-[#c28e46] transition-colors disabled:opacity-60"
                            aria-label={`Rôle de ${member.email}`}
                          >
                            <option value="viewer">Lecteur</option>
                            <option value="editor">Éditeur</option>
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.email)}
                          className="text-[#8a8171] hover:text-[#93000a] hover:bg-[#3a3835] p-2 rounded transition-colors flex-shrink-0"
                          aria-label={`Retirer ${member.email}`}
                          title="Retirer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invite Form - Admin only */}
          {isAdmin && (
            <form onSubmit={handleInvite} className="mt-6 bg-[#211f1c] border-2 border-[#504538] rounded-lg p-5">
              <p className="text-[#c28e46] font-label text-xs uppercase tracking-wider mb-4 font-bold">
                Recruter un Chasseur
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Adresse e-mail du Chasseur..."
                  className="flex-1 bg-[#2c2a26] border-2 border-[#504538] text-[#e3d5b8] px-4 py-2 placeholder-[#8a8171] focus:border-[#c28e46] focus:outline-none font-body text-sm rounded transition-colors"
                  required
                  aria-label="Email du membre à inviter"
                  disabled={inviteLoading}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-[#c28e46] hover:bg-[#e8b879] text-[#151310] font-headline font-bold uppercase tracking-widest transition-colors disabled:opacity-60 text-xs rounded"
                  disabled={inviteLoading}
                >
                  <Plus size={16} />
                  Inviter
                </button>
              </div>
              {inviteError && (
                <p className="text-[#ffb4ab] text-xs mt-3 font-medium">
                  {inviteError}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Quests/Tasks Section */}
        <div className="mb-8">
          <h2 className="font-headline text-2xl text-[#c28e46] mb-6 flex items-center gap-2 uppercase tracking-widest">
            <CheckCircle2 size={24} />
            Quêtes Partagées ({displayedTasks.length})
          </h2>

          <div className="bg-[#211f1c] border-2 border-[#504538] rounded-lg overflow-hidden">
            {displayedTasks.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[#8a8171] font-body italic">Aucune quête pour le moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#504538]">
                {displayedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 hover:bg-[#2c2a26] transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Affiche soit la checkbox, soit le badge "Validé" (ils se remplacent l'un l'autre) */}
                      {task.completed ? (
                        <button
                          onClick={() =>
                            handleUpdateTask(task.id, {
                              completed: !task.completed,
                            })
                          }
                          className="flex-shrink-0 text-[#22c55e] cursor-pointer font-semibold transition-all px-3 py-1 border border-[#22c55e] rounded hover:bg-[#22c55e] hover:text-[#151310]"
                          title="Marquer incomplet"
                        >
                          Validé
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleUpdateTask(task.id, {
                              completed: !task.completed,
                            })
                          }
                          className={`flex-shrink-0 w-6 h-6 border flex items-center justify-center transition-colors bg-[#151310] ${
                            task.completed
                              ? "border-[#c28e46]"
                              : "border-[#504538] hover:border-[#c28e46]"
                          }`}
                          title={task.completed ? "Marquer incomplet" : "Marquer complété"}
                        >
                          {task.completed && (
                            <CheckCircle2 size={16} className="text-[#151310]" />
                          )}
                        </button>
                      )}
                      
                      {/* Task content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-body truncate ${
                            task.completed
                              ? "line-through text-[#8a8171]"
                              : "text-[#e3d5b8]"
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {task.addedBy && (
                            <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider">
                              Par: <span className="text-[#c28e46]">{task.addedBy}</span>
                            </p>
                          )}
                          {task.priority && (
                            <span className={`font-label text-xs uppercase tracking-wider px-2 py-1 rounded ${
                              task.priority === "haute"
                                ? "bg-[#93000a]/30 text-[#ffb4ab]"
                                : task.priority === "moyenne"
                                ? "bg-[#c28e46]/30 text-[#e8b879]"
                                : "bg-[#504538]/50 text-[#8a8171]"
                            }`}>
                              {task.priority === "haute" ? "Haute" : task.priority === "moyenne" ? "Moyenne" : "Basse"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete button container */}
                    <div className="flex items-center gap-4">
                      {/* Delete button - only for editors */}
                      {isEditor && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-[#c28e46] border border-[#c28e46] rounded p-2 hover:bg-[#c28e46] hover:text-[#e3d5b8] transition-colors duration-200 cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100"
                          aria-label="Supprimer la quête"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Task Section - Editors and Admins only */}
        {canAddTasks && (
          <div className="bg-[#211f1c] border-2 border-[#504538] rounded-lg p-6">
            <button
              onClick={handleShowAddTask}
              className="flex items-center gap-2 text-[#c28e46] font-headline font-bold uppercase tracking-widest text-sm hover:text-[#e8b879] transition-colors mb-4 leading-none"
            >
              <Plus size={18} />
              Ajouter une Quête
            </button>

            {showAddTask && (
              <div className="bg-[#2c2a26] p-5 border-2 border-[#504538] rounded">
                <AddTaskForm onAddTask={handleAddTask} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Modal de confirmation suppression membre */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#f7f5f2] rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-headline text-[#23201a] mb-4">
              Retirer du groupe ?
            </h2>
            <p className="text-[#5c564c] font-body mb-6">
              Êtes-vous sûr de vouloir retirer <strong>{memberToRemove}</strong> de cette escouade ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelRemove}
                className="flex-1 px-4 py-2 bg-[#e3d5b8] text-[#23201a] font-headline font-bold uppercase text-xs rounded hover:bg-[#d1c5ae] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 px-4 py-2 bg-[#93000a] text-[#f7f5f2] font-headline font-bold uppercase text-xs rounded hover:bg-[#a40010] transition-colors"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal de confirmation quitter escouade */}
      {memberToLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#f7f5f2] rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-headline text-[#23201a] mb-4">
              Quitter cette escouade ?
            </h2>
            <p className="text-[#5c564c] font-body mb-6">
              Êtes-vous sûr de vouloir quitter <strong>{list.name}</strong> ? Vous perdrez l'accès à toutes les quêtes partagées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelLeave}
                className="flex-1 px-4 py-2 bg-[#e3d5b8] text-[#23201a] font-headline font-bold uppercase text-xs rounded hover:bg-[#d1c5ae] transition-colors"
              >
                Rester
              </button>
              <button
                onClick={handleConfirmLeave}
                className="flex-1 px-4 py-2 bg-[#93000a] text-[#f7f5f2] font-headline font-bold uppercase text-xs rounded hover:bg-[#a40010] transition-colors"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
