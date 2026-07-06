import { prisma } from '../config/database';
import { CreateTaskInput, UpdateTaskInput, ReorderTaskInput, CreateChecklistItemInput, CreateCommentInput } from '../types/task';

const taskInclude = {
  assignedTo: {
    select: { id: true, name: true, avatarUrl: true },
  },
  createdBy: {
    select: { id: true, name: true, avatarUrl: true },
  },
  updatedBy: {
    select: { id: true, name: true, avatarUrl: true },
  },
  labels: {
    include: {
      label: {
        select: { id: true, name: true, color: true },
      },
    },
  },
  checklist: {
    orderBy: { order: 'asc' },
  },
  comments: {
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
  attachments: {
    include: {
      uploadedBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
  activityLogs: {
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
};

export const taskRepository = {
  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });
  },

  async findByBoardId(boardId: string) {
    return prisma.task.findMany({
      where: { boardId },
      include: taskInclude,
      orderBy: { order: 'asc' },
    });
  },

  async findByColumnId(columnId: string) {
    return prisma.task.findMany({
      where: { columnId },
      include: taskInclude,
      orderBy: { order: 'asc' },
    });
  },

  async create(data: CreateTaskInput & { createdById: string; order: number }) {
    const { labelIds, ...taskData } = data;

    return prisma.task.create({
      data: {
        ...taskData,
        labels: labelIds
          ? {
              create: labelIds.map((labelId) => ({
                label: { connect: { id: labelId } },
              })),
            }
          : undefined,
      },
      include: taskInclude,
    });
  },

  async update(id: string, data: UpdateTaskInput & { updatedById?: string }) {
    const { labelIds, ...taskData } = data;

    // If labelIds provided, disconnect all existing and reconnect new ones
    if (labelIds !== undefined) {
      await prisma.taskLabel.deleteMany({
        where: { taskId: id },
      });
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        labels: labelIds
          ? {
              create: labelIds.map((labelId) => ({
                label: { connect: { id: labelId } },
              })),
            }
          : undefined,
      },
      include: taskInclude,
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  },

  async reorder(taskId: string, targetColumnId: string, newOrder: number) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: targetColumnId,
        order: newOrder,
      },
      include: taskInclude,
    });
  },

  // --- Labels ---
  async addLabel(taskId: string, labelId: string) {
    return prisma.taskLabel.create({
      data: {
        taskId,
        labelId,
      },
      include: {
        task: { include: taskInclude },
      },
    });
  },

  async removeLabel(taskId: string, labelId: string) {
    await prisma.taskLabel.delete({
      where: {
        taskId_labelId: {
          taskId,
          labelId,
        },
      },
    });
    return prisma.task.findUnique({
      where: { id: taskId },
      include: taskInclude,
    });
  },

  // --- Checklist ---
  async addChecklistItem(taskId: string, data: CreateChecklistItemInput) {
    const lastItem = await prisma.checklistItem.findFirst({
      where: { taskId },
      orderBy: { order: 'desc' },
    });

    return prisma.checklistItem.create({
      data: {
        taskId,
        text: data.text,
        order: data.order ?? (lastItem ? lastItem.order + 1 : 0),
      },
    });
  },

  async toggleChecklistItem(itemId: string) {
    const item = await prisma.checklistItem.findUnique({
      where: { id: itemId },
    });
    if (!item) return null;

    return prisma.checklistItem.update({
      where: { id: itemId },
      data: { isCompleted: !item.isCompleted },
    });
  },

  async deleteChecklistItem(itemId: string) {
    return prisma.checklistItem.delete({
      where: { id: itemId },
    });
  },

  // --- Comments ---
  async getComments(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  async addComment(taskId: string, userId: string, data: CreateCommentInput) {
    return prisma.comment.create({
      data: {
        taskId,
        userId,
        content: data.content,
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  },

  async deleteComment(commentId: string): Promise<void> {
    await prisma.comment.delete({
      where: { id: commentId },
    });
  },

  // --- Attachments ---
  async getAttachments(taskId: string) {
    return prisma.attachment.findMany({
      where: { taskId },
      include: {
        uploadedBy: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  async addAttachment(taskId: string, uploadedById: string, fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }) {
    return prisma.attachment.create({
      data: {
        taskId,
        uploadedById,
        ...fileData,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  },

  async deleteAttachment(attachmentId: string): Promise<void> {
    await prisma.attachment.delete({
      where: { id: attachmentId },
    });
  },

  // --- Activity Logs ---
  async getActivityLogs(taskId: string) {
    return prisma.activityLog.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  async createActivityLog(taskId: string, userId: string, action: string, details?: string) {
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
};