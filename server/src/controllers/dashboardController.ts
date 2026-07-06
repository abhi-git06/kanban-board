import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const dashboardController = {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const stats = await dashboardService.getStats(userId);
      sendSuccess(res, stats, 200);
    } catch (error) {
      next(error);
    }
  },

  async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const activity = await dashboardService.getRecentActivity(userId, limit);
      sendSuccess(res, activity, 200);
    } catch (error) {
      next(error);
    }
  },

  async getProductivityData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const data = await dashboardService.getProductivityData(userId);
      sendSuccess(res, data, 200);
    } catch (error) {
      next(error);
    }
  },
};