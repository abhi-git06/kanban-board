import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBoards } from '../hooks/useBoards';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { cn } from '../utils/cn';

export default function DashboardPage() {
  const { user } = useAuth();
  const { boards, isLoading, createBoard } = useBoards();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const favouriteBoards = boards.filter((b) => b.isFavourite && !b.isArchived);
  const recentBoards = [...boards]
    .filter((b) => !b.isArchived)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const totalTasks = boards.reduce((acc, b) => acc + (b.columns?.reduce((c, col) => c + (col.tasks?.length || 0), 0) || 0), 0);

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    setIsCreating(true);
    try {
      const board = await createBoard({ title: newBoardTitle.trim(), description: newBoardDesc.trim() || undefined });
      setIsCreateModalOpen(false);
      setNewBoardTitle('');
      setNewBoardDesc('');
      navigate(`/board/${board.id}`);
    } catch {
      // Error handled by hook
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-kanban-text">
          Good {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-1 text-sm text-kanban-textMuted">
          Here's what's happening across your workspace today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Boards" value={boards.length} icon="board" color="blue" />
        <StatCard label="Favourites" value={favouriteBoards.length} icon="star" color="yellow" />
        <StatCard label="Active Tasks" value={totalTasks} icon="task" color="green" />
        <StatCard label="Archived" value={boards.filter((b) => b.isArchived).length} icon="archive" color="gray" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-kanban-text">Your Boards</h2>
        <Button
          variant="primary"
          size="sm"
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Board
        </Button>
      </div>

      {/* Boards Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : recentBoards.length === 0 ? (
        <EmptyState
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          }
          title="No boards yet"
          description="Create your first board to start organizing your tasks and collaborating with your team."
          actionLabel="Create Board"
          actionOnClick={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentBoards.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/board/${board.id}`)}
              className={cn(
                'group relative rounded-lg border border-kanban-border bg-white p-5 cursor-pointer transition-all',
                'hover:shadow-card hover:border-kanban-primary/30'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded bg-gradient-to-br from-kanban-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                  {board.title.charAt(0).toUpperCase()}
                </div>
                {board.isFavourite && (
                  <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-kanban-text mb-1 group-hover:text-kanban-primary transition-colors">
                {board.title}
              </h3>
              {board.description && (
                <p className="text-sm text-kanban-textMuted line-clamp-2 mb-3">{board.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-kanban-textMuted">
                <span>
                  {board.columns?.reduce((acc, c) => acc + (c.tasks?.length || 0), 0) || 0} tasks
                </span>
                <span>{board.columns?.length || 0} columns</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create new board"
        description="Give your board a name and optional description to get started."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isCreating}
              onClick={handleCreateBoard}
              disabled={!newBoardTitle.trim()}
            >
              Create Board
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Board title"
            placeholder="e.g., Q3 Product Roadmap"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            autoFocus
          />
          <Input
            label="Description"
            placeholder="What's this board about?"
            value={newBoardDesc}
            onChange={(e) => setNewBoardDesc(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

// Helper components
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    gray: 'bg-gray-50 text-gray-600',
  };

  const iconMap: Record<string, React.ReactNode> = {
    board: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    star: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    task: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    archive: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  };

  return (
    <div className="rounded-lg border border-kanban-border bg-white p-4">
      <div className={cn('inline-flex rounded-md p-2 mb-3', colorMap[color])}>{iconMap[icon]}</div>
      <p className="text-2xl font-bold text-kanban-text">{value}</p>
      <p className="text-sm text-kanban-textMuted">{label}</p>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}