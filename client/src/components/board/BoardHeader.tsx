import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../../types/board';
import { useBoards } from '../../hooks/useBoards';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../utils/cn';

interface BoardHeaderProps {
  board: Board;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  const navigate = useNavigate();
  const { updateBoard, archiveBoard, favouriteBoard } = useBoards();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(board.title);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTitle = async () => {
    if (!editTitle.trim() || editTitle === board.title) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateBoard(board.id, { title: editTitle.trim() });
      setIsEditing(false);
    } catch {
      setEditTitle(board.title);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveTitle();
    if (e.key === 'Escape') {
      setEditTitle(board.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/50 border-b border-kanban-border shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveTitle}
              className="w-64"
              autoFocus
              disabled={isSaving}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveTitle}
              isLoading={isSaving}
            >
              Save
            </Button>
          </div>
        ) : (
          <>
            <h1
              className="text-lg font-bold text-kanban-text cursor-pointer hover:bg-kanban-bg rounded px-2 py-1 -ml-2 transition-colors truncate max-w-md"
              onClick={() => setIsEditing(true)}
              title="Click to rename"
            >
              {board.title}
            </h1>
            <button
              onClick={() => favouriteBoard(board.id, !board.isFavourite)}
              className={cn(
                'p-1.5 rounded-md transition-colors shrink-0',
                board.isFavourite
                  ? 'text-yellow-500 hover:bg-yellow-50'
                  : 'text-kanban-textMuted hover:bg-kanban-bg'
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
          </>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => archiveBoard(board.id)}
        >
          {board.isArchived ? 'Unarchive' : 'Archive'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/board/${board.id}/settings`)}
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Button>
      </div>
    </div>
  );
}