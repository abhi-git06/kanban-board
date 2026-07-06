import { useBoards } from '../../hooks/useBoards';
import { cn } from '../../utils/cn';

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function StatsCards() {
  const { boards } = useBoards();

  const totalTasks = boards.reduce(
    (acc, b) => acc + (b.columns?.reduce((c, col) => c + (col.tasks?.length || 0), 0) || 0),
    0
  );

  const completedTasks = boards.reduce(
    (acc, b) =>
      acc +
      (b.columns?.reduce(
        (c, col) => c + (col.tasks?.filter((t) => t.status === 'DONE').length || 0),
        0
      ) || 0),
    0
  );

  const overdueTasks = boards.reduce(
    (acc, b) =>
      acc +
      (b.columns?.reduce(
        (c, col) =>
          c +
          (col.tasks?.filter((t) => {
            if (!t.dueDate || t.status === 'DONE') return false;
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return due < now;
          }).length || 0),
        0
      ) || 0),
    0
  );

  const highPriorityTasks = boards.reduce(
    (acc, b) =>
      acc +
      (b.columns?.reduce(
        (c, col) =>
          c + (col.tasks?.filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT').length || 0),
        0
      ) || 0),
    0
  );

  const stats: StatItem[] = [
    {
      label: 'Total Boards',
      value: boards.length,
      color: 'blue',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      color: 'indigo',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'Completed',
      value: completedTasks,
      color: 'green',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      color: 'red',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'High Priority',
      value: highPriorityTasks,
      color: 'orange',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Favourites',
      value: boards.filter((b) => b.isFavourite).length,
      color: 'yellow',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', iconBg: 'bg-indigo-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
    red: { bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', iconBg: 'bg-orange-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'rounded-lg border border-kanban-border p-4 transition-shadow hover:shadow-sm',
            colorMap[stat.color]?.bg || 'bg-white'
          )}
        >
          <div
            className={cn(
              'inline-flex rounded-md p-2 mb-3',
              colorMap[stat.color]?.iconBg || 'bg-gray-100',
              colorMap[stat.color]?.text || 'text-gray-600'
            )}
          >
            {stat.icon}
          </div>
          <p className={cn('text-2xl font-bold', colorMap[stat.color]?.text || 'text-kanban-text')}>
            {stat.value}
          </p>
          <p className="text-xs text-kanban-textMuted mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}