import { Request, Response, NextFunction } from 'express';
import { columnService } from '../services/columnService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const columnController = {
  async getColumns(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { boardId } = req.query as { boardId: string };
      const columns = await columnService.getColumns(boardId, userId);
      sendSuccess(res, columns, 200);
    } catch (error) {
      next(error);
    }
  },

  async getColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const column = await columnService.getColumn(id, userId);
      sendSuccess(res, column, 200);
    } catch (error) {
      next(error);
    }
  },

  async createColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const column = await columnService.createColumn(req.body, userId);
      sendSuccess(res, column, 201, 'Column created successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const column = await columnService.updateColumn(id, req.body, userId);
      sendSuccess(res, column, 200, 'Column updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      await columnService.deleteColumn(id, userId);
      sendSuccess(res, null, 200, 'Column deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async reorderColumns(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { boardId, columns } = req.body;
      const reordered = await columnService.reorderColumns(boardId, columns, userId);
      sendSuccess(res, reordered, 200, 'Columns reordered successfully');
    } catch (error) {
      next(error);
    }
  },
};