import { useState } from 'react';
import { Board } from '../../types/board';
import { useBoards } from '../../hooks/useBoards';
import { cn } from '../../utils/cn';

interface BoardCardProps {
  board: Board;
  onClick: () => void;
}

export default function BoardCard({ board, onClick }: BoardCardProps) {
  const { favouriteBoard } = useBoards();
  const [isFavouriting, setIsFavouriting] = useState(false);

  const taskCount = board.columns?.reduce(
    (acc, col) => acc + (col.tasks?.length || 0),
    0
  ) || 0;

  const handleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavouriting) return;
    setIsFavouriting(true);
    try {
      await favouriteBoard(board.id, !board.isFavourite);
    } finally {
      setIsFavouriting(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-lg border bg-white p-5 cursor-pointer transition-all',
        'hover:shadow-card hover:border-kanban-primary/30',
        board.isArchived && 'opacity-60 bg-gray-50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg',
            'bg-gradient-to-br from-kanban-primary to-blue-400'
          )}
        >
          {board.title.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={handleFavourite}
          disabled={isFavouriting}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            board.isFavourite
              ? 'text-yellow-500 hover:bg-yellow-50'
              : 'text-kanban-textMuted hover:text-yellow-500 hover:bg-yellow-50'
          )}
          title={board.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <svg
            className="h-5 w-5"
            fill={board.isFavourite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-kanban-text mb-1 group-hover:text-kanban-primary transition-colors">
        {board.title}
      </h3>
      {board.description && (
        <p className="text-sm text-kanban-textMuted line-clamp-2 mb-3">
          {board.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-kanban-textMuted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            {board.columns?.length || 0} {board.columns?.length === 1 ? 'column' : 'columns'}
          </span>
        </div>
        {board.isArchived && (
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
            Archived
          </span>
        )}
      </div>
    </div>
  );
}