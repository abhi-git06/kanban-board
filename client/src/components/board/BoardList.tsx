import { useNavigate } from 'react-router-dom';
import { useBoards } from '../../hooks/useBoards';
import { Spinner } from '../common/Spinner';
import { EmptyState } from '../common/EmptyState';
import BoardCard from './BoardCard';

export default function BoardList() {
  const { boards, isLoading, error } = useBoards();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        }
        title="Failed to load boards"
        description={error}
        actionLabel="Retry"
        actionOnClick={() => window.location.reload()}
      />
    );
  }

  if (boards.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        }
        title="No boards yet"
        description="Create your first board to start organizing your tasks and collaborating with your team."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onClick={() => navigate(`/board/${board.id}`)}
        />
      ))}
    </div>
  );
}