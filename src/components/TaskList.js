"use client";
import { CheckSquare2 } from "lucide-react";
import TaskItem from "./TaskItem";

const TaskList = ({ taskItems = [], onToggleTask, onEditTask, onDeleteTask }) => {
  return (
    <>
      {taskItems.length > 0 ? (
        // Section tâches actives
        <section aria-label="Liste des tâches">
          <div className="flex flex-col gap-4 font-body">
            {taskItems.map((taskItem) => (
              <TaskItem
                key={taskItem.id}
                id={taskItem.id}
                title={taskItem.title}
                description={taskItem.description}
                priority={taskItem.priority}
                completed={taskItem.completed}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
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