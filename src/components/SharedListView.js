"use client";

import { useState } from "react";
import { User, Trash2, ArrowLeft, Plus } from "lucide-react";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";

export default function SharedListView({
  list,
  tasks = [],
  currentUserId,
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

  const isOwner = list.ownerId === currentUserId;

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
    <section className="max-w-2xl mx-auto w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 mt-6 font-body">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
        aria-label="Retour"
      >
        <ArrowLeft size={18} aria-hidden="true" /> Retour
      </button>
      <h1 className="text-2xl font-bold text-on-surface mb-2 flex items-center gap-2">
        {list.name}
      </h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-on-surface-variant mb-2">Membres</h2>
        <ul className="flex flex-wrap gap-2 mb-2">
          {members.filter(m => !!m.email).map((member) => (
            <li key={member.email} className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full text-sm">
              <User size={14} className="text-primary" aria-hidden="true" />
              <span>{member.email}</span>
              {isOwner && member.id !== currentUserId && (
                <button
                  type="button"
                  onClick={() => onRemoveMember?.(member)}
                  className="ml-1 p-1 rounded-full hover:bg-error/10 text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-error-container"
                  aria-label={`Retirer ${member.email}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              )}
              {member.id === list.ownerId && (
                <span className="ml-1 px-2 py-0.5 rounded bg-primary text-on-primary text-xs font-bold uppercase">Propriétaire</span>
              )}
            </li>
          ))}
        </ul>
        {isOwner && (
          <form onSubmit={handleInvite} className="flex gap-2 mt-2 flex-wrap items-center">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="Email du membre..."
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-highest text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              required
              aria-label="Email du membre à inviter"
              disabled={inviteLoading}
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
              disabled={inviteLoading}
            >
              <Plus size={16} aria-hidden="true" /> Inviter
            </button>
            {inviteError && <span className="text-error text-sm ml-2">{inviteError}</span>}
          </form>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-on-surface-variant mb-2">Tâches partagées</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskList
                tasks={[{ ...task, description: task.addedBy ? `Ajoutée par : ${task.addedBy}` : undefined }]}
                onToggle={() => onUpdateTask(task.id, { completed: !task.completed })}
                onEdit={() => onUpdateTask(task.id, { /* à compléter selon l'UI d'édition */ })}
                onDelete={() => onDeleteTask(task.id)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-on-surface-variant mb-2">Ajouter une tâche</h2>
        <AddTaskForm onAddTask={onAddTask} />
      </div>
    </section>
  );
}
