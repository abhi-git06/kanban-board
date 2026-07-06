import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType } from '../../types/column';
import { Task as TaskType } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../utils/cn';
import TaskCard from '../task/TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onTaskClick: (taskId: string) => void;
}

export default function Column({ column, tasks, onTaskClick }: ColumnProps) {
  const { createTask, deleteColumn } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columnTasks = tasks
    .filter((t) => t.columnId === column.id)
    .sort((a, b) => a.order - b.order);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !column.boardId) return;
    setIsSubmitting(true);
    try {
      await createTask({
        boardId: column.boardId,
        columnId: column.id,
        title: newTaskTitle.trim(),
      });
      setNewTaskTitle('');
      setIsAddingTask(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-72 flex-col rounded-lg bg-kanban-column max-h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-sm text-kanban-text truncate">{column.title}</h3>
          <span className="text-xs text-kanban-textMuted bg-white/60 px-1.5 py-0.5 rounded">
            {columnTasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAddingTask(true)}
            className="p-1 rounded hover:bg-white/60 text-kanban-textMuted hover:text-kanban-text transition-colors"
            title="Add task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${column.title}" column? All tasks will be lost.`)) {
                deleteColumn(column.id);
              }
            }}
            className="p-1 rounded hover:bg-red-50 text-kanban-textMuted hover:text-red-600 transition-colors"
            title="Delete column"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-thin min-h-[100px]">
        <SortableContext
          items={columnTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </SortableContext>

        {/* Add Task Inline */}
        {isAddingTask && (
          <div className="bg-white rounded-md p-3 shadow-card">
            <Input
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="text-sm mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }
              }}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddTask}
                isLoading={isSubmitting}
                disabled={!newTaskTitle.trim()}
              >
                Add Task
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}