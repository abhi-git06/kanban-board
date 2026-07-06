import { useBoards } from '../../hooks/useBoards';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';
import { cn } from '../../utils/cn';

interface ChartBar {
  label: string;
  value: number;
  color: string;
  bgClass: string;
}

export default function ProductivityChart() {
  const { boards } = useBoards();

  // Aggregate data across all boards
  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};

  boards.forEach((board) => {
    board.columns?.forEach((column) => {
      column.tasks?.forEach((task) => {
        statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
        priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
      });
    });
  });

  const totalTasks = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

  const statusBars: ChartBar[] = [
    { label: 'Backlog', value: statusCounts.BACKLOG || 0, color: STATUS_COLORS.BACKLOG?.text || 'text-gray-600', bgClass: STATUS_COLORS.BACKLOG?.bg || 'bg-gray-100' },
    { label: 'To Do', value: statusCounts.TODO || 0, color: STATUS_COLORS.TODO?.text || 'text-blue-600', bgClass: STATUS_COLORS.TODO?.bg || 'bg-blue-100' },
    { label: 'In Progress', value: statusCounts.IN_PROGRESS || 0, color: STATUS_COLORS.IN_PROGRESS?.text || 'text-yellow-700', bgClass: STATUS_COLORS.IN_PROGRESS?.bg || 'bg-yellow-100' },
    { label: 'Review', value: statusCounts.REVIEW || 0, color: STATUS_COLORS.REVIEW?.text || 'text-purple-700', bgClass: STATUS_COLORS.REVIEW?.bg || 'bg-purple-100' },
    { label: 'Done', value: statusCounts.DONE || 0, color: STATUS_COLORS.DONE?.text || 'text-green-700', bgClass: STATUS_COLORS.DONE?.bg || 'bg-green-100' },
  ];

  const priorityBars: ChartBar[] = [
    { label: 'Low', value: priorityCounts.LOW || 0, color: PRIORITY_COLORS.LOW?.text || 'text-gray-700', bgClass: PRIORITY_COLORS.LOW?.bg || 'bg-gray-100' },
    { label: 'Medium', value: priorityCounts.MEDIUM || 0, color: PRIORITY_COLORS.MEDIUM?.text || 'text-blue-700', bgClass: PRIORITY_COLORS.MEDIUM?.bg || 'bg-blue-100' },
    { label: 'High', value: priorityCounts.HIGH || 0, color: PRIORITY_COLORS.HIGH?.text || 'text-orange-700', bgClass: PRIORITY_COLORS.HIGH?.bg || 'bg-orange-100' },
    { label: 'Urgent', value: priorityCounts.URGENT || 0, color: PRIORITY_COLORS.URGENT?.text || 'text-red-700', bgClass: PRIORITY_COLORS.URGENT?.bg || 'bg-red-100' },
  ];

  const ChartSection = ({ title, bars }: { title: string; bars: ChartBar[] }) => {
    const maxValue = Math.max(...bars.map((b) => b.value), 1);

    return (
      <div className="bg-white rounded-lg border border-kanban-border p-5">
        <h3 className="text-sm font-semibold text-kanban-text mb-4">{title}</h3>
        <div className="space-y-3">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-kanban-textMuted">{bar.label}</span>
                <span className={cn('text-xs font-semibold', bar.color)}>{bar.value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', bar.bgClass)}
                  style={{ width: `${(bar.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (totalTasks <= 1) {
    return (
      <div className="bg-white rounded-lg border border-kanban-border p-8 text-center">
        <p className="text-sm text-kanban-textMuted">Create tasks to see productivity charts.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartSection title="Tasks by Status" bars={statusBars} />
      <ChartSection title="Tasks by Priority" bars={priorityBars} />
    </div>
  );
}