"use client";
import { CheckSquare2 } from "lucide-react";
import TaskItem from "./TaskItem";

const TaskList = ({
  tasks = [],
  taskItems,
  onToggle,
  onToggleTask,
  onEdit,
  onEditTask,
  onDelete,
  onDeleteTask,
  editingTaskId,
  draftTaskTitle,
  onDraftChange,
  onEditCancel,
  onEditConfirm,
  pendingDeleteTaskId,
  onDeleteCancel,
  onDeleteConfirm,
}) => {
  // Support both 'tasks' and 'taskItems' prop names for compatibility
  const taskList = tasks && tasks.length > 0 ? tasks : (taskItems || []);
  // Support both callback names for compatibility
  const handleToggle = onToggle || onToggleTask;
  const handleEdit = onEdit || onEditTask;
  const handleDelete = onDelete || onDeleteTask;

  return (
    <>
      {taskList.length > 0 ? (
        // Section tâches actives
        <section aria-label="Liste des tâches">
          <div className="flex flex-col gap-4 font-body">
            {taskList.map((task) => (
              <div key={task.id}>
                {/* Mode édition */}
                {editingTaskId === task.id && (
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 mb-4">
                    <label className="block text-sm font-semibold text-on-surface mb-2">
                      Modifier le titre
                    </label>
                    <input
                      type="text"
                      value={draftTaskTitle}
                      onChange={(e) => onDraftChange?.(e.target.value)}
                      className="w-full mb-3 px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-highest text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={onEditConfirm}
                        className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={onEditCancel}
                        className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* TaskItem affiché normalement */}
                {editingTaskId !== task.id && (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    priority={task.priority}
                    completed={task.completed}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    addedBy={task.addedBy}
                  />
                )}

                {/* Modale de confirmation de suppression */}
                {pendingDeleteTaskId === task.id && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-surface rounded-2xl p-6 max-w-sm mx-4 border border-outline-variant/20 shadow-xl">
                      <h2 className="text-lg font-bold text-on-surface mb-2">
                        Supprimer cette tâche ?
                      </h2>
                      <p className="text-on-surface-variant mb-4">
                        Cette action ne peut pas être annulée.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={onDeleteConfirm}
                          className="flex-1 px-4 py-2 rounded-lg bg-error text-on-error font-semibold hover:bg-error/90 transition-colors"
                        >
                          Supprimer
                        </button>
                        <button
                          onClick={onDeleteCancel}
                          className="flex-1 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        // Section d'état vide
        <section
          className="mt-16 pt-16 border-t border-outline-variant/10"
          aria-label="Aucune tâche disponible"
        >
          <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low/40 rounded-3xl border border-dashed border-outline-variant/30 font-body">
            <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mb-6 shadow-sm">
              <CheckSquare2
                size={34}
                className="text-outline-variant"
                aria-hidden="true"
              />
            </div>
            <p className="font-headline font-semibold text-on-surface mb-1">
              Aucune tâche pour le moment
            </p>
            <p className="font-body text-on-surface-variant text-sm max-w-60 text-center">
              Votre sanctuaire est en ordre. Profitez de ce moment de calme.
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default TaskList;