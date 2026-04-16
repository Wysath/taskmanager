"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";
import TaskItem from "./TaskItem";
import Modal from "./Modal";

/**
 * Composant TaskItem réordonnable avec dnd-kit
 * Enveloppe TaskItem avec la logique drag & drop et la poignée de déplacement
 */
const SortableTaskItem = ({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onEdit,
  onDelete,
  addedBy,
  editingTaskId,
  draftTaskTitle,
  onDraftChange,
  onEditCancel,
  onEditConfirm,
  pendingDeleteTaskId,
  onDeleteCancel,
  onDeleteConfirm,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? "z-50" : ""}`}
    >
      {/* Mode édition */}
      {editingTaskId === id && (
        <div className="edit-card">
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Modifier le titre
          </label>
          <input
            type="text"
            value={draftTaskTitle}
            onChange={(e) => onDraftChange?.(e.target.value)}
            className="input-sm mb-3"
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={onEditConfirm} className="btn-primary">
              Confirmer
            </button>
            <button onClick={onEditCancel} className="btn-secondary">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Mode normal avec poignée de déplacement */}
      {editingTaskId !== id && (
        <div className="flex items-stretch gap-3">
          {/* Poignée de déplacement */}
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center cursor-grab active:cursor-grabbing p-2 rounded-l text-[#8a8171] hover:text-[#c28e46] transition-colors opacity-60 group-hover:opacity-100"
            title="Glissez pour réorganiser"
            aria-label="Poignée de déplacement"
          >
            <Grip size={18} aria-hidden="true" />
          </div>

          {/* Tâche */}
          <div className="flex-1">
            <TaskItem
              id={id}
              title={title}
              description={description}
              priority={priority}
              completed={completed}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              addedBy={addedBy}
            />
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      <Modal
        open={pendingDeleteTaskId === id}
        onClose={onDeleteCancel}
        variant="danger"
        size="small"
      >
        <Modal.Header onClose={onDeleteCancel}>
          <Modal.Title>Supprimer cette tâche ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Cette action ne peut pas être annulée.</p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={onDeleteCancel} className="btn btn-secondary">
            Annuler
          </button>
          <button onClick={onDeleteConfirm} className="btn btn-error">
            Supprimer
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SortableTaskItem;
