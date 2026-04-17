"use client";
import { useMemo, useCallback } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTaskItem from "./SortableTaskItem";
import Modal from "./Modal";
import { CheckSquare2 } from "lucide-react";

const arrayMove = (array, from, to) => {
  const newArray = [...array];
  const item = newArray.splice(from, 1)[0];
  newArray.splice(to, 0, item);
  return newArray;
};

const TaskList = ({
  tasks = [],
  taskItems,
  onToggle,
  onToggleTask,
  onEdit,
  onEditTask,
  onDelete,
  onDeleteTask,
  onReorder,
  editingTaskId,
  draftTaskTitle,
  onDraftChange,
  onEditCancel,
  onEditConfirm,
  pendingDeleteTaskId,
  onDeleteCancel,
  onDeleteConfirm,
}) => {
  const taskList = useMemo(() => (
    tasks && tasks.length > 0 ? tasks : (taskItems || [])
  ), [tasks, taskItems]);

  const handleToggle = useCallback(
    onToggle || onToggleTask ? (...args) => (onToggle || onToggleTask)(...args) : undefined,
    [onToggle, onToggleTask]
  );
  const handleEdit = useCallback(
    onEdit || onEditTask ? (...args) => (onEdit || onEditTask)(...args) : undefined,
    [onEdit, onEditTask]
  );
  const handleDelete = useCallback(
    onDelete || onDeleteTask ? (...args) => (onDelete || onDeleteTask)(...args) : undefined,
    [onDelete, onDeleteTask]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = taskList.findIndex((task) => task.id === active.id);
    const newIndex = taskList.findIndex((task) => task.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reorderedList = arrayMove(taskList, oldIndex, newIndex);
    if (onReorder) {
      onReorder(reorderedList);
    }
  }, [taskList, onReorder]);

  const handleDraftChange = useCallback(
    (value) => onDraftChange?.(value),
    [onDraftChange]
  );
  const handleEditConfirm = useCallback(() => onEditConfirm?.(), [onEditConfirm]);
  const handleEditCancel = useCallback(() => onEditCancel?.(), [onEditCancel]);
  const handleDeleteCancel = useCallback(() => onDeleteCancel?.(), [onDeleteCancel]);
  const handleDeleteConfirm = useCallback(() => onDeleteConfirm?.(), [onDeleteConfirm]);

  const sortableItemIds = useMemo(() => taskList.map((task) => task.id), [taskList]);

  return (
    <>
      {taskList.length === 0 ? (
        <section
          className="empty-state-section flex items-center justify-center min-h-80"
          aria-label="Aucune tâche disponible"
        >
          <div className="empty-state-card text-center">
            <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mb-6 shadow-sm mx-auto">
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
      ) : (
        <section aria-label="Liste des tâches">
          <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableItemIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4 font-body">
            {taskList.map((task) => (
              <div key={task.id}>
                {editingTaskId === task.id ? (
                  <div className="edit-card">
                    <label className="block text-sm font-semibold text-on-surface mb-2">
                      Modifier le titre
                    </label>
                    <input
                      type="text"
                      value={draftTaskTitle}
                      onChange={(e) => handleDraftChange(e.target.value)}
                      className="input-sm mb-3"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditConfirm}
                        className="btn-primary"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="btn-secondary"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <SortableTaskItem
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
                    editingTaskId={editingTaskId}
                    draftTaskTitle={draftTaskTitle}
                    onDraftChange={handleDraftChange}
                    onEditCancel={handleEditCancel}
                    onEditConfirm={handleEditConfirm}
                    pendingDeleteTaskId={pendingDeleteTaskId}
                    onDeleteCancel={handleDeleteCancel}
                    onDeleteConfirm={handleDeleteConfirm}
                  />
                )}

                {/* Modale de confirmation de suppression */}
                <Modal
                  open={pendingDeleteTaskId === task.id}
                  onClose={handleDeleteCancel}
                  variant="danger"
                  size="small"
                >
                  <Modal.Header onClose={handleDeleteCancel}>
                    <Modal.Title>Supprimer cette tâche ?</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Cette action ne peut pas être annulée.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <button
                      onClick={handleDeleteCancel}
                      className="btn btn-secondary"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="btn btn-error"
                    >
                      Supprimer
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
        </section>
      )}
    </>
  );
};

export default TaskList;