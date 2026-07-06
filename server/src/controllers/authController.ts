import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 201, 'Account created successfully');
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 200, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      sendSuccess(res, null, 200, 'Logout successful');
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      sendSuccess(res, { tokens }, 200, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const user = await authService.getMe(userId);
      sendSuccess(res, user, 200);
    } catch (error) {
      next(error);
    }
  },
};