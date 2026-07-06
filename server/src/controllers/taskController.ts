import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const taskController = {
  // --- CRUD ---
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { boardId } = req.query as { boardId: string };
      const tasks = await taskService.getTasks(boardId, userId);
      sendSuccess(res, tasks, 200);
    } catch (error) {
      next(error);
    }
  },

  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const task = await taskService.getTask(id, userId);
      sendSuccess(res, task, 200);
    } catch (error) {
      next(error);
    }
  },

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const task = await taskService.createTask(req.body, userId);
      sendSuccess(res, task, 201, 'Task created successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const task = await taskService.updateTask(id, req.body, userId);
      sendSuccess(res, task, 200, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      await taskService.deleteTask(id, userId);
      sendSuccess(res, null, 200, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // --- Reordering ---
  async reorderTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const task = await taskService.reorderTask(req.body, userId);
      sendSuccess(res, task, 200, 'Task moved successfully');
    } catch (error) {
      next(error);
    }
  },

  // --- Labels ---
  async addLabel(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const { labelId } = req.body;
      const task = await taskService.addLabel(id, labelId, userId);
      sendSuccess(res, task, 200, 'Label added successfully');
    } catch (error) {
      next(error);
    }
  },

  async removeLabel(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id, labelId } = req.params;
      const task = await taskService.removeLabel(id, labelId, userId);
      sendSuccess(res, task, 200, 'Label removed successfully');
    } catch (error) {
      next(error);
    }
  },

  // --- Checklist ---
  async addChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const item = await taskService.addChecklistItem(id, req.body, userId);
      sendSuccess(res, item, 201, 'Checklist item added');
    } catch (error) {
      next(error);
    }
  },

  async toggleChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id, itemId } = req.params;
      const item = await taskService.toggleChecklistItem(id, itemId, userId);
      sendSuccess(res, item, 200, 'Checklist item updated');
    } catch (error) {
      next(error);
    }
  },

  async deleteChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id, itemId } = req.params;
      await taskService.deleteChecklistItem(id, itemId, userId);
      sendSuccess(res, null, 200, 'Checklist item deleted');
    } catch (error) {
      next(error);
    }
  },

  // --- Comments ---
  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const comments = await taskService.getComments(id, userId);
      sendSuccess(res, comments, 200);
    } catch (error) {
      next(error);
    }
  },

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const comment = await taskService.addComment(id, req.body, userId);
      sendSuccess(res, comment, 201, 'Comment added');
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id, commentId } = req.params;
      await taskService.deleteComment(id, commentId, userId);
      sendSuccess(res, null, 200, 'Comment deleted');
    } catch (error) {
      next(error);
    }
  },

  // --- Attachments ---
  async getAttachments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const attachments = await taskService.getAttachments(id, userId);
      sendSuccess(res, attachments, 200);
    } catch (error) {
      next(error);
    }
  },

  async addAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      // File upload handling would go here (multer middleware)
      // For now, assume fileData is passed in body
      const fileData = req.body;
      const attachment = await taskService.addAttachment(id, userId, fileData);
      sendSuccess(res, attachment, 201, 'Attachment uploaded');
    } catch (error) {
      next(error);
    }
  },

  async deleteAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id, attachmentId } = req.params;
      await taskService.deleteAttachment(id, attachmentId, userId);
      sendSuccess(res, null, 200, 'Attachment deleted');
    } catch (error) {
      next(error);
    }
  },

  // --- Activity Logs ---
  async getActivityLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const logs = await taskService.getActivityLogs(id, userId);
      sendSuccess(res, logs, 200);
    } catch (error) {
      next(error);
    }
  },
};