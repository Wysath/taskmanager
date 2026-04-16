"use client";

import { useState } from "react";
import { User, Trash2, ArrowLeft, Plus, Users, Shield, CheckCircle2, X, Sword, Crown } from "lucide-react";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";

export default function SharedListView({
  list,
  tasks = [],
  currentUserId,
  currentUserEmail,
  members = [],
  onAddMember,
  onRemoveMember,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onBack,
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const isOwner = list.ownerId === currentUserId;
  
  // Obtient le rôle de l'utilisateur courant
  const currentUserRole = members.find(m => m.email?.toLowerCase() === currentUserEmail?.toLowerCase())?.role || "viewer";
  const isAdmin = currentUserRole === "admin";
  const isEditor = currentUserRole === "editor" || isAdmin;
  const canAddTasks = isEditor;
  const canInviteMembers = isAdmin;

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError("");
    if (!inviteEmail.trim()) {
      setInviteError("L'e-mail est requis");
      return;
    }
    setInviteLoading(true);
    try {
      await onAddMember?.(inviteEmail.trim());
      setInviteEmail("");
    } catch (err) {
      setInviteError(err.message || "Erreur lors de l'ajout du membre");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#211f1c] border-4 border-[#504538] p-8">
      {/* Header with back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-[#c28e46] hover:text-[#e8b879] transition-colors font-headline uppercase text-sm tracking-widest"
        aria-label="Retour"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Retour aux Escouades
      </button>

      {/* Squad Header */}
      <div className="mb-8 pb-6 border-b border-[#504538]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-headline text-[#e8e1dc] uppercase tracking-widest mb-2">
              {list.name}
            </h1>
            <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider">
              Escouade dirigée par un Chasseur
            </p>
          </div>
          <Sword size={56} className="text-[#c28e46]" />
        </div>
      </div>

      {/* Members Section */}
      <div className="mb-8">
        <h2 className="font-headline text-2xl text-[#c28e46] mb-4 flex items-center gap-2 uppercase tracking-widest">
          <Users size={24} />
          Compagnons ({members.filter(m => !!m.email).length})
        </h2>
        
        {/* Members List */}
        <div className="bg-[#2c2a26] border-2 border-[#504538] p-6 mb-4">
          {members.filter(m => !!m.email).length === 0 ? (
            <p className="text-[#8a8171] font-body italic">Aucun membre pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {members.filter(m => !!m.email).map((member) => (
                <li key={member.email} className="flex items-center justify-between p-3 bg-[#3a3835] border border-[#504538]">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-[#c28e46] flex items-center justify-center text-[#151310] font-bold">
                      {member.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[#e8e1dc] font-body">{member.email}</p>
                      <div className="flex items-center gap-2">
                        {member.role === "admin" && (
                          <p className="text-[#c28e46] font-label text-xs uppercase tracking-wider flex items-center gap-1">
                            <Crown size={14} /> Chef d'Escouade
                          </p>
                        )}
                        {member.role === "editor" && !member.role === "admin" && (
                          <p className="text-[#c28e46] font-label text-xs uppercase tracking-wider flex items-center gap-1">
                            <Shield size={14} /> Éditeur
                          </p>
                        )}
                        {member.role === "viewer" && (
                          <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider flex items-center gap-1">
                            <User size={14} /> Lecteur
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {isAdmin && member.role !== "admin" && (
                    <button
                      type="button"
                      onClick={() => onRemoveMember?.(member.email)}
                      className="text-[#8a8171] hover:text-[#93000a] transition-colors"
                      aria-label={`Retirer ${member.email}`}
                      title="Retirer de l'Escouade"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Invite Form - Admin only */}
        {isAdmin && (
          <form onSubmit={handleInvite} className="bg-[#2c2a26] border-2 border-[#504538] p-4">
            <p className="text-[#c28e46] font-label text-xs uppercase tracking-wider mb-3 font-bold">
              Recruter un Chasseur
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="Adresse e-mail du Chasseur..."
                className="flex-1 bg-[#3a3835] border-2 border-[#504538] text-[#e3d5b8] px-3 py-2 placeholder-[#8a8171] focus:border-[#c28e46] focus:outline-none font-body text-sm"
                required
                aria-label="Email du membre à inviter"
                disabled={inviteLoading}
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-[#c28e46] text-[#151310] font-headline font-bold uppercase tracking-widest hover:bg-[#e8b879] transition-colors disabled:opacity-60 text-xs"
                disabled={inviteLoading}
              >
                <Plus size={16} />
                Inviter
              </button>
            </div>
            {inviteError && <p className="text-[#ffb4ab] text-xs mt-2 font-medium">{inviteError}</p>}
          </form>
        )}
      </div>

      {/* Quests/Tasks Section */}
      <div className="mb-8">
        <h2 className="font-headline text-2xl text-[#c28e46] mb-4 flex items-center gap-2 uppercase tracking-widest">
          <CheckCircle2 size={24} />
          Quêtes partagées ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <div className="bg-[#2c2a26] border-2 border-[#504538] p-8 text-center">
            <p className="text-[#8a8171] font-body italic">Aucune quête pour le moment.</p>
          </div>
        ) : (
          <div className="bg-[#2c2a26] border-2 border-[#504538] space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border-b border-[#504538] last:border-0 hover:bg-[#3a3835] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-[#c28e46] border-[#c28e46]"
                        : "border-[#504538] hover:border-[#c28e46]"
                    }`}
                  >
                    {task.completed && <CheckCircle2 size={16} className="text-[#151310]" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-body ${task.completed ? "line-through text-[#8a8171]" : "text-[#e3d5b8]"}`}>
                      {task.title}
                    </p>
                    {task.addedBy && (
                      <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider">
                        Posté par: {task.addedBy}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-[#8a8171] hover:text-[#93000a] transition-colors flex-shrink-0"
                  aria-label="Supprimer la quête"
                  disabled={!isEditor}
                  style={{ opacity: isEditor ? 1 : 0.4, cursor: isEditor ? "pointer" : "not-allowed" }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Section - Admin and Editor only */}
      {canAddTasks && (
        <div className="bg-[#2c2a26] border-2 border-[#504538] p-6">
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="flex items-center gap-2 text-[#c28e46] font-headline font-bold uppercase tracking-widest text-sm hover:text-[#e8b879] transition-colors mb-4"
          >
            <Plus size={20} />
            Ajouter une Quête
          </button>
        
          {showAddTask && (
            <div className="bg-[#3a3835] p-4 border border-[#504538]">
              <AddTaskForm onAddTask={async (taskData) => {
                await onAddTask(taskData);
                setShowAddTask(false);
              }} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
