import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { formatRelativeDate, isOverdue } from '../../utils/formatDate';
import { cn } from '../../utils/cn';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { deleteTask } = useTasks();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'group relative rounded-md bg-white p-3 shadow-card cursor-grab active:cursor-grabbing transition-all',
        'hover:shadow-lg border border-transparent hover:border-kanban-primary/20',
        isDragging && 'opacity-50 rotate-2 scale-105 z-50'
      )}
    >
      {/* Delete button (visible on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('Delete this task?')) {
            deleteTask(task.id);
          }
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-kanban-textMuted hover:text-red-600 transition-all z-10"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: label.color + '20', color: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm font-medium text-kanban-text line-clamp-2 mb-2 pr-6">
        {task.title}
      </h4>

      {/* Footer: Priority, Due Date, Assignee */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.priority && <PriorityBadge priority={task.priority} size="sm" />}
          {task.dueDate && (
            <span
              className={cn(
                'text-[10px] flex items-center gap-1',
                isOverdue(task.dueDate) ? 'text-red-600' : 'text-kanban-textMuted'
              )}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatRelativeDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div
            className="h-6 w-6 rounded-full bg-kanban-primary text-white text-[10px] flex items-center justify-center font-medium"
            title={task.assignedTo.name}
          >
            {task.assignedTo.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}