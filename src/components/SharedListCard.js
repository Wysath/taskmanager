"use client";

import { Users, Trash2, Crown, ListChecks } from "lucide-react";

export default function SharedListCard({ list, currentUserId, onOpen, onDelete }) {
  const isOwner = list.ownerId === currentUserId;
  const totalTasks = list.tasksCount ?? 0;
  const completedTasks = list.completedTasksCount ?? 0;
  const membersCount = list.members?.length ?? 0;

  return (
    <article
      className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-4 font-body"
      aria-label={`Liste partagée ${list.name}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <ListChecks size={20} className="text-primary" aria-hidden="true" />
          {list.name}
        </h2>
        {isOwner && (
          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase">
            <Crown size={14} className="inline-block mr-1 -mt-0.5" aria-hidden="true" />
            Propriétaire
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-on-surface-variant text-sm">
        <span className="flex items-center gap-1">
          <Users size={16} aria-hidden="true" />
          <span className="font-semibold">{membersCount}</span> membre{membersCount > 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <ListChecks size={16} aria-hidden="true" />
          <span className="font-semibold">{completedTasks}</span> / {totalTasks} complétées
        </span>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => onOpen?.(list)}
          className="flex-1 px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 transition-colors"
          aria-label={`Ouvrir la liste ${list.name}`}
        >
          Ouvrir
        </button>
        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete?.(list)}
            className="px-4 py-2 rounded-lg bg-error text-on-error font-semibold hover:bg-error/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-error-container focus-visible:ring-offset-2 transition-colors"
            aria-label={`Supprimer la liste ${list.name}`}
          >
            <Trash2 size={16} aria-hidden="true" />
            <span className="ml-1">Supprimer</span>
          </button>
        )}
      </div>
    </article>
  );
}
