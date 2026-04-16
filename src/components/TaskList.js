"use client";
import { CheckSquare2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";
import SortableTaskItem from "./SortableTaskItem";
import Modal from "./Modal";

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
  // Support both 'tasks' and 'taskItems' prop names for compatibility
  const taskList = tasks && tasks.length > 0 ? tasks : (taskItems || []);
  // Support both callback names for compatibility
  const handleToggle = onToggle || onToggleTask;
  const handleEdit = onEdit || onEditTask;
  const handleDelete = onDelete || onDeleteTask;

  // Configuration des capteurs pour dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8, // Minimum de pixels à déplacer avant d'activer le drag
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Gestion de la fin du drag & drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    // Trouvez les indices dans la liste actuelle
    const oldIndex = taskList.findIndex((task) => task.id === active.id);
    const newIndex = taskList.findIndex((task) => task.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Utilise arrayMove pour une manipulation correcte de l'ordre
    const reorderedList = arrayMove(taskList, oldIndex, newIndex);

    // Appelle le callback avec la nouvelle liste réorganisée
    if (onReorder) {
      onReorder(reorderedList);
    }
  };

  return (
    <>
      {taskList.length > 0 ? (
        // Section tâches actives
        <section aria-label="Liste des tâches">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={taskList.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4 font-body">
                {taskList.map((task) => (
                  <div key={task.id}>
                    {/* Mode édition */}
                    {editingTaskId === task.id && (
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
                          <button
                            onClick={onEditConfirm}
                            className="btn-primary"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={onEditCancel}
                            className="btn-secondary"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SortableTaskItem affiché normalement */}
                    {editingTaskId !== task.id && (
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
                        onDraftChange={onDraftChange}
                        onEditCancel={onEditCancel}
                        onEditConfirm={onEditConfirm}
                        pendingDeleteTaskId={pendingDeleteTaskId}
                        onDeleteCancel={onDeleteCancel}
                        onDeleteConfirm={onDeleteConfirm}
                      />
                    )}

                    {/* Modale de confirmation de suppression */}
                    <Modal
                      open={pendingDeleteTaskId === task.id}
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
                        <button
                          onClick={onDeleteCancel}
                          className="btn btn-secondary"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={onDeleteConfirm}
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
      ) : (
        // Section d'état vide
        <section
          className="empty-state-section"
          aria-label="Aucune tâche disponible"
        >
          <div className="empty-state-card">
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