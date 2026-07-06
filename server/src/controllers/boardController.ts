import { Request, Response, NextFunction } from 'express';
import { boardService } from '../services/boardService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const boardController = {
  async getBoards(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const boards = await boardService.getAllBoards(userId);
      sendSuccess(res, boards, 200);
    } catch (error) {
      next(error);
    }
  },

  async getBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const board = await boardService.getBoard(id, userId);
      sendSuccess(res, board, 200);
    } catch (error) {
      next(error);
    }
  },

  async createBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const board = await boardService.createBoard(req.body, userId);
      sendSuccess(res, board, 201, 'Board created successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const board = await boardService.updateBoard(id, req.body, userId);
      sendSuccess(res, board, 200, 'Board updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      await boardService.deleteBoard(id, userId);
      sendSuccess(res, null, 200, 'Board deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async archiveBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const board = await boardService.archiveBoard(id, userId);
      sendSuccess(res, board, 200, `Board ${board.isArchived ? 'archived' : 'unarchived'} successfully`);
    } catch (error) {
      next(error);
    }
  },

  async favouriteBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const { isFavourite } = req.body;
      const board = await boardService.favouriteBoard(id, userId, isFavourite);
      sendSuccess(res, board, 200, `Board ${board.isFavourite ? 'added to' : 'removed from'} favourites`);
    } catch (error) {
      next(error);
    }
  },

  async getBoardMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const members = await boardService.getBoardMembers(id, userId);
      sendSuccess(res, members, 200);
    } catch (error) {
      next(error);
    }
  },

  async inviteMember(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id } = req.params;
      const member = await boardService.inviteMember(id, userId, req.body);
      sendSuccess(res, member, 201, 'Member invited successfully');
    } catch (error) {
      next(error);
    }
  },

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user!.userId;
      const { id, memberId } = req.params;
      await boardService.removeMember(id, memberId, userId);
      sendSuccess(res, null, 200, 'Member removed successfully');
    } catch (error) {
      next(error);
    }
  },
};