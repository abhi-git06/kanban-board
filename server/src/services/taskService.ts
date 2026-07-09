import { taskRepository } from '../repositories/taskRepository';
import { boardRepository } from '../repositories/boardRepository';
import { columnRepository } from '../repositories/columnRepository';
import { activityRepository } from '../repositories/activityRepository';
import { ApiError } from '../utils/response';
import {
  CreateTaskInput,
  UpdateTaskInput,
  ReorderTaskInput,
  CreateChecklistItemInput,
  CreateCommentInput,
} from '../types/task';

async function checkTaskAccess(taskId: string, userId: string): Promise<void> {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new ApiError('Task not found', 404, 'NOT_FOUND');
  }

  const board = await boardRepository.findById(task.boardId);
  if (!board) {
    throw new ApiError('Board not found', 404, 'NOT_FOUND');
  }

  const hasAccess =
    board.ownerId === userId ||
    board.members?.some((m) => m.userId === userId);

  if (!hasAccess) {
    throw new ApiError('Access denied', 403, 'FORBIDDEN');
  }
}

async function checkWriteAccess(boardId: string, userId: string): Promise<void> {
  const board = await boardRepository.findById(boardId);
  if (!board) {
    throw new ApiError('Board not found', 404, 'NOT_FOUND');
  }

  const memberRole = board.members?.find((m) => m.userId === userId)?.role;
  if (board.ownerId !== userId && memberRole === 'MEMBER') {
    throw new ApiError('Only owners and admins can perform this action', 403, 'FORBIDDEN');
  }
}

export const taskService = {
  // --- CRUD ---
  async getTasks(boardId: string, userId: string) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new ApiError('Board not found', 404, 'NOT_FOUND');
    }

    const hasAccess =
      board.ownerId === userId ||
      board.members?.some((m) => m.userId === userId);

    if (!hasAccess) {
      throw new ApiError('Access denied', 403, 'FORBIDDEN');
    }

    return taskRepository.findByBoardId(boardId);
  },

  async getTask(taskId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new ApiError('Task not found', 404, 'NOT_FOUND');
    }
    return task;
  },

  async createTask(data: CreateTaskInput, userId: string) {
    await checkWriteAccess(data.boardId, userId);

    // Verify column exists and belongs to board
    const column = await columnRepository.findById(data.columnId);
    if (!column || column.boardId !== data.boardId) {
      throw new ApiError('Column not found in this board', 404, 'NOT_FOUND');
    }

    // Get highest order in column
    const columnTasks = await taskRepository.findByColumnId(data.columnId);
    const maxOrder = columnTasks.length > 0
      ? Math.max(...columnTasks.map((t) => t.order))
      : -1;

    const task = await taskRepository.create({
      ...data,
      createdById: userId,
      order: maxOrder + 1,
    });

    await activityRepository.create(
      task.id,
      userId,
      'created task',
      `Created "${task.title}"`
    );

    return task;
  },

  async updateTask(taskId: string, data: UpdateTaskInput, userId: string) {
    const existingTask = await taskRepository.findById(taskId);
    if (!existingTask) {
      throw new ApiError('Task not found', 404, 'NOT_FOUND');
    }

    await checkWriteAccess(existingTask.boardId, userId);

    const updatedTask = await taskRepository.update(taskId, {
      ...data,
      updatedById: userId,
    });

    // Log changes
    const changes: string[] = [];
    if (data.title && data.title !== existingTask.title) {
      changes.push(`title to "${data.title}"`);
    }
    if (data.status && data.status !== existingTask.status) {
      changes.push(`status to ${data.status}`);
    }
    if (data.priority && data.priority !== existingTask.priority) {
      changes.push(`priority to ${data.priority}`);
    }
    if (data.columnId && data.columnId !== existingTask.columnId) {
      const newColumn = await columnRepository.findById(data.columnId);
      changes.push(`column to "${newColumn?.title || 'Unknown'}"`);
    }

    if (changes.length > 0) {
      await activityRepository.create(
        taskId,
        userId,
        'updated task',
        `Changed ${changes.join(', ')}`
      );
    }

    return updatedTask;
  },

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new ApiError('Task not found', 404, 'NOT_FOUND');
    }

    await checkWriteAccess(task.boardId, userId);

    await taskRepository.delete(taskId);
  },

  // --- Reordering ---
  async reorderTask(data: ReorderTaskInput, userId: string) {
    const task = await taskRepository.findById(data.taskId);
    if (!task) {
      throw new ApiError('Task not found', 404, 'NOT_FOUND');
    }

    await checkWriteAccess(task.boardId, userId);

    // Verify target column exists
    const targetColumn = await columnRepository.findById(data.targetColumnId);
    if (!targetColumn || targetColumn.boardId !== task.boardId) {
      throw new ApiError('Target column not found in this board', 404, 'NOT_FOUND');
    }

    const isCrossColumn = data.sourceColumnId !== data.targetColumnId;

    const reordered = await taskRepository.reorder(
      data.taskId,
      data.targetColumnId,
      data.newOrder
    );

    if (isCrossColumn) {
      await activityRepository.create(
        data.taskId,
        userId,
        'moved task',
        `Moved to "${targetColumn.title}"`
      );
    }

    return reordered;
  },

  // --- Labels ---
  async addLabel(taskId: string, labelId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    await checkWriteAccess((await taskRepository.findById(taskId))!.boardId, userId);
    return taskRepository.addLabel(taskId, labelId);
  },

  async removeLabel(taskId: string, labelId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    await checkWriteAccess((await taskRepository.findById(taskId))!.boardId, userId);
    return taskRepository.removeLabel(taskId, labelId);
  },

  // --- Checklist ---
  async addChecklistItem(taskId: string, data: CreateChecklistItemInput, userId: string) {
    await checkTaskAccess(taskId, userId);
    const task = await taskRepository.findById(taskId);
    if (!task) throw new ApiError('Task not found', 404, 'NOT_FOUND');

    await checkWriteAccess(task.boardId, userId);

    const item = await taskRepository.addChecklistItem(taskId, data);
    await activityRepository.create(taskId, userId, 'added checklist item', `Added "${data.text}"`);
    return item;
  },

  async toggleChecklistItem(taskId: string, itemId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    const task = await taskRepository.findById(taskId);
    if (!task) throw new ApiError('Task not found', 404, 'NOT_FOUND');

    await checkWriteAccess(task.boardId, userId);

    const item = await taskRepository.toggleChecklistItem(itemId);
    if (item) {
      await activityRepository.create(
        taskId,
        userId,
        item.isCompleted ? 'completed checklist item' : 'unchecked checklist item',
        `"${item.text}"`
      );
    }
    return item;
  },

  async deleteChecklistItem(taskId: string, itemId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    const task = await taskRepository.findById(taskId);
    if (!task) throw new ApiError('Task not found', 404, 'NOT_FOUND');

    await checkWriteAccess(task.boardId, userId);

    await taskRepository.deleteChecklistItem(itemId);
  },

  // --- Comments ---
  async getComments(taskId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    return taskRepository.getComments(taskId);
  },

  async addComment(taskId: string, data: CreateCommentInput, userId: string) {
    await checkTaskAccess(taskId, userId);
    return taskRepository.addComment(taskId, userId, data);
  },

  async deleteComment(taskId: string, commentId: string, userId: string): Promise<void> {
    await checkTaskAccess(taskId, userId);

    const comments = await taskRepository.getComments(taskId);
    const comment = comments.find((c) => c.id === commentId);

    if (!comment) {
      throw new ApiError('Comment not found', 404, 'NOT_FOUND');
    }

    // Users can only delete their own comments, unless admin/owner
    const task = await taskRepository.findById(taskId);
    if (!task) throw new ApiError('Task not found', 404, 'NOT_FOUND');

    const board = await boardRepository.findById(task.boardId);
    const memberRole = board?.members?.find((m) => m.userId === userId)?.role;

    if (comment.userId !== userId && board?.ownerId !== userId && memberRole !== 'ADMIN') {
      throw new ApiError('Can only delete your own comments', 403, 'FORBIDDEN');
    }

    await taskRepository.deleteComment(commentId);
  },

  // --- Attachments ---
  async getAttachments(taskId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    return taskRepository.getAttachments(taskId);
  },

  async addAttachment(
    taskId: string,
    userId: string,
    fileData: { fileName: string; fileUrl: string; fileType: string; fileSize: number }
  ) {
    await checkTaskAccess(taskId, userId);
    const task = await taskRepository.findById(taskId);
    if (!task) throw new ApiError('Task not found', 404, 'NOT_FOUND');

    await checkWriteAccess(task.boardId, userId);

    const attachment = await taskRepository.addAttachment(taskId, userId, fileData);
    await activityRepository.create(taskId, userId, 'added attachment', `Added "${fileData.fileName}"`);
    return attachment;
  },

  async deleteAttachment(taskId: string, attachmentId: string, userId: string): Promise<void> {
    await checkTaskAccess(taskId, userId);
    const task = await taskRepository.findById(taskId);
    if (!task) throw new ApiError('Task not found', 404, 'NOT_FOUND');

    await checkWriteAccess(task.boardId, userId);
    await taskRepository.deleteAttachment(attachmentId);
  },

  // --- Activity Logs ---
  async getActivityLogs(taskId: string, userId: string) {
    await checkTaskAccess(taskId, userId);
    return activityRepository.findByTaskId(taskId);
  },
};