import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBoards } from '../../hooks/useBoards';
import { Avatar } from '../common/Avatar';

export default function Sidebar() {
  const { user } = useAuth();
  const { boards } = useBoards();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const favouriteBoards = boards.filter((b) => b.isFavourite && !b.isArchived);
  const allBoards = boards.filter((b) => !b.isArchived);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`flex flex-col bg-white border-r border-kanban-border transition-all duration-200 shrink-0 ${
        isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-64 opacity-100'
      }`}
    >
      {/* Workspace Header */}
      <div className="p-4 border-b border-kanban-border">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatarUrl} name={user?.name || 'Workspace'} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-kanban-text truncate">{user?.name}'s Workspace</p>
            <p className="text-xs text-kanban-textMuted">Free Plan</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isActive('/dashboard')
              ? 'bg-kanban-primary/10 text-kanban-primary'
              : 'text-kanban-text hover:bg-kanban-bg'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>

        {/* Favourites */}
        {favouriteBoards.length > 0 && (
          <div className="mt-4">
            <p className="px-3 text-xs font-semibold text-kanban-textMuted uppercase tracking-wider mb-1">
              Favourites
            </p>
            {favouriteBoards.map((board) => (
              <Link
                key={board.id}
                to={`/board/${board.id}`}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  location.pathname.startsWith(`/board/${board.id}`)
                    ? 'bg-kanban-primary/10 text-kanban-primary font-medium'
                    : 'text-kanban-text hover:bg-kanban-bg'
                }`}
              >
                <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="truncate">{board.title}</span>
              </Link>
            ))}
          </div>
        )}

        {/* All Boards */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-3 mb-1">
            <p className="text-xs font-semibold text-kanban-textMuted uppercase tracking-wider">
              Your Boards
            </p>
            <span className="text-xs text-kanban-textMuted">{allBoards.length}</span>
          </div>
          {allBoards.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                location.pathname.startsWith(`/board/${board.id}`)
                  ? 'bg-kanban-primary/10 text-kanban-primary font-medium'
                  : 'text-kanban-text hover:bg-kanban-bg'
              }`}
            >
              <span className="h-4 w-4 rounded bg-gradient-to-br from-kanban-primary to-blue-400 flex-shrink-0" />
              <span className="truncate">{board.title}</span>
              {board.isArchived && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  Archived
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-center p-2 border-t border-kanban-border text-kanban-textMuted hover:text-kanban-text hover:bg-kanban-bg transition-colors"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
}