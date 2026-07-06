import { useBoards } from '../../hooks/useBoards';
import { formatRelativeDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

interface ActivityItem {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  userName: string;
  boardTitle: string;
  taskTitle: string;
  type: 'create' | 'update' | 'move' | 'complete' | 'comment';
}

export default function RecentActivity() {
  const { boards } = useBoards();

  // Derive activity from task data (in a real app, this would come from an API)
  const activities: ActivityItem[] = boards
    .flatMap((board) =>
      board.columns?.flatMap((column) =>
        column.tasks?.flatMap((task) => {
          const items: ActivityItem[] = [];

          // Task creation
          items.push({
            id: `${task.id}-created`,
            action: 'created task',
            details: null,
            createdAt: task.createdAt,
            userName: task.createdBy?.name || 'Unknown',
            boardTitle: board.title,
            taskTitle: task.title,
            type: 'create',
          });

          // Comments
          task.comments?.forEach((comment) => {
            items.push({
              id: `${comment.id}-comment`,
              action: 'commented on',
              details: comment.content,
              createdAt: comment.createdAt,
              userName: comment.user?.name || 'Unknown',
              boardTitle: board.title,
              taskTitle: task.title,
              type: 'comment',
            });
          });

          return items;
        }) || []
      ) || []
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'create':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'update':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'move':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      case 'complete':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-kanban-border p-8 text-center">
        <p className="text-sm text-kanban-textMuted">No recent activity to show.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-kanban-border p-5">
      <h3 className="text-sm font-semibold text-kanban-text mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-kanban-text">
                <span className="font-medium">{activity.userName}</span>{' '}
                <span className="text-kanban-textMuted">{activity.action}</span>{' '}
                <span className="font-medium">{activity.taskTitle}</span>
              </p>
              {activity.details && (
                <p className="text-xs text-kanban-textMuted mt-0.5 line-clamp-2">{activity.details}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-kanban-textMuted bg-kanban-bg px-1.5 py-0.5 rounded">
                  {activity.boardTitle}
                </span>
                <span className="text-[10px] text-kanban-textMuted">
                  {formatRelativeDate(activity.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}