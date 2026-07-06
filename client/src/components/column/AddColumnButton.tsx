import { useState } from 'react';
import { useColumns } from '../../hooks/useColumns';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

interface AddColumnButtonProps {
  boardId: string;
}

export default function AddColumnButton({ boardId }: AddColumnButtonProps) {
  const { createColumn } = useColumns();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await createColumn({ boardId, title: title.trim() });
      setTitle('');
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setTitle('');
    }
  };

  if (isAdding) {
    return (
      <div className="flex w-72 flex-col rounded-lg bg-kanban-column p-3 shrink-0">
        <Input
          placeholder="Enter column title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="text-sm mb-2"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!title.trim()}
          >
            Add Column
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(false);
              setTitle('');
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className={cn(
        'flex h-fit w-72 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-kanban-border',
        'bg-kanban-bg p-4 text-sm font-medium text-kanban-textMuted',
        'hover:border-kanban-primary/40 hover:text-kanban-text transition-colors shrink-0'
      )}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Add another column
    </button>
  );
}