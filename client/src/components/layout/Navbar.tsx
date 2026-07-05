import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-14 bg-white border-b border-kanban-border flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2 text-kanban-primary hover:opacity-80 transition-opacity">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="text-lg font-bold tracking-tight hidden sm:block">Kanban</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-kanban-textMuted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tasks, boards, or members..."
            className="block w-full rounded-md border border-kanban-border bg-kanban-bg py-1.5 pl-10 pr-3 text-sm text-kanban-text placeholder:text-kanban-textMuted focus:border-kanban-primary focus:outline-none focus:ring-1 focus:ring-kanban-primary/20"
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
          onClick={() => navigate('/dashboard')}
          className="hidden sm:inline-flex"
        >
          New Board
        </Button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-md p-1 hover:bg-kanban-bg transition-colors focus:outline-none focus:ring-2 focus:ring-kanban-primary/20"
          >
            <Avatar src={user?.avatarUrl} name={user?.name || 'User'} size="sm" />
            <span className="text-sm font-medium text-kanban-text hidden lg:block">{user?.name}</span>
            <svg
              className={`h-4 w-4 text-kanban-textMuted transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg border border-kanban-border py-1 z-20">
                <div className="px-4 py-2 border-b border-kanban-border">
                  <p className="text-sm font-medium text-kanban-text">{user?.name}</p>
                  <p className="text-xs text-kanban-textMuted truncate">{user?.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-sm text-kanban-text hover:bg-kanban-bg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}