import { boardRepository } from '../repositories/boardRepository';
import { activityRepository } from '../repositories/activityRepository';
import { ApiError } from '../utils/response';
import { Status } from '@prisma/client';

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  highPriorityTasks: number;
  totalBoards: number;
  favouriteBoards: number;
  archivedBoards: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date;
  taskTitle: string;
  boardTitle: string;
}

export const dashboardService = {
  async getStats(userId: string): Promise<DashboardStats> {
    const boards = await boardRepository.findAllByUserId(userId);

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;
    let highPriorityTasks = 0;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (const board of boards) {
      for (const column of board.columns || []) {
        for (const task of column.tasks || []) {
          totalTasks++;

          if (task.status === Status.DONE) {
            completedTasks++;
          } else {
            pendingTasks++;
          }

          if (task.priority === 'HIGH' || task.priority === 'URGENT') {
            highPriorityTasks++;
          }

          if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (dueDate < now && task.status !== Status.DONE) {
              overdueTasks++;
            }
          }
        }
      }
    }

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      highPriorityTasks,
      totalBoards: boards.length,
      favouriteBoards: boards.filter((b) => b.isFavourite).length,
      archivedBoards: boards.filter((b) => b.isArchived).length,
    };
  },

  async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    const boards = await boardRepository.findAllByUserId(userId);
    const boardIds = boards.map((b) => b.id);

    if (boardIds.length === 0) {
      return [];
    }

    // Get recent activity across all user's boards
    const activities = await Promise.all(
      boardIds.map((boardId) => activityRepository.findByBoardId(boardId, Math.ceil(limit / boardIds.length)))
    );

    const flatActivities = activities
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return flatActivities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      details: activity.details,
      createdAt: activity.createdAt,
      taskTitle: (activity as any).task?.title || 'Unknown Task',
      boardTitle: boards.find((b) => b.id === (activity as any).task?.boardId)?.title || 'Unknown Board',
    }));
  },

  async getProductivityData(userId: string) {
    const boards = await boardRepository.findAllByUserId(userId);

    // Group tasks by status for chart data
    const statusCounts: Record<string, number> = {};
    const priorityCounts: Record<string, number> = {};

    for (const board of boards) {
      for (const column of board.columns || []) {
        for (const task of column.tasks || []) {
          statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
          priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
        }
      }
    }

    return {
      byStatus: Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      })),
      byPriority: Object.entries(priorityCounts).map(([priority, count]) => ({
        priority,
        count,
      })),
    };
  },
};