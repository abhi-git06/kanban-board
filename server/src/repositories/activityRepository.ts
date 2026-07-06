import { prisma } from '../config/database';

export const activityRepository = {
  async findByTaskId(taskId: string) {
    return prisma.activityLog.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByBoardId(boardId: string, limit: number = 50) {
    return prisma.activityLog.findMany({
      where: {
        task: {
          boardId,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
        task: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async findByUserId(userId: string, limit: number = 20) {
    return prisma.activityLog.findMany({
      where: { userId },
      include: {
        task: {
          select: { id: true, title: true, boardId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async create(taskId: string, userId: string, action: string, details?: string) {
    return prisma.activityLog.create({
      data: {
        taskId,
        userId,
        action,
        details,
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  },

  async deleteByTaskId(taskId: string): Promise<void> {
    await prisma.activityLog.deleteMany({
      where: { taskId },
    });
  },
};