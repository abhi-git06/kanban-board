import { useState } from 'react';
import { Column as ColumnType } from '../../types/column';
import { useColumns } from '../../hooks/useColumns';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

interface ColumnHeaderProps {
  column: ColumnType;
  taskCount: number;
  onAddTask: () => void;
}

export default function ColumnHeader({ column, taskCount, onAddTask }: ColumnHeaderProps) {
  const { updateColumn, deleteColumn } = useColumns();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle === column.title) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateColumn(column.id, { title: editTitle.trim() });
      setIsEditing(false);
    } catch {
      setEditTitle(column.title);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="text-sm w-full"
              autoFocus
              disabled={isSaving}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              className="!px-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          </div>
        ) : (
          <>
            <h3
              className="font-semibold text-sm text-kanban-text truncate cursor-pointer hover:bg-white/60 rounded px-1.5 py-0.5 -ml-1.5 transition-colors"
              onClick={() => setIsEditing(true)}
              title="Click to rename"
            >
              {column.title}
            </h3>
            <span className="text-xs text-kanban-textMuted bg-white/60 px-1.5 py-0.5 rounded shrink-0">
              {taskCount}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        <button
          onClick={onAddTask}
          className="p-1 rounded hover:bg-white/60 text-kanban-textMuted hover:text-kanban-text transition-colors"
          title="Add task"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${column.title}"? All tasks will be lost.`)) {
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
  );
}