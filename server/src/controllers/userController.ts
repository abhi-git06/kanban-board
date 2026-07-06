import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const userController = {
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      sendSuccess(res, user, 200);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const user = await userService.updateProfile(userId, req.body);
      sendSuccess(res, user, 200, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { q } = req.query as { q: string };
      const users = await userService.searchUsers(q, userId);
      sendSuccess(res, users, 200);
    } catch (error) {
      next(error);
    }
  },

  async getUserBoards(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const boards = await userService.getUserBoards(userId);
      sendSuccess(res, boards, 200);
    } catch (error) {
      next(error);
    }
  },
};