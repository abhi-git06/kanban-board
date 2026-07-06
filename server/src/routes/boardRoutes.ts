import { Router } from 'express';
import { boardController } from '../controllers/boardController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authMiddleware';
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdSchema,
  inviteMemberSchema,
  removeMemberSchema,
} from '../validators/boardValidator';

const router = Router();

// All board routes require authentication
router.use(authenticate);

// Board CRUD
router.get('/', boardController.getBoards);
router.get('/:id', validateRequest(boardIdSchema), boardController.getBoard);
router.post('/', validateRequest(createBoardSchema), boardController.createBoard);
router.patch('/:id', validateRequest(updateBoardSchema), boardController.updateBoard);
router.delete('/:id', validateRequest(boardIdSchema), boardController.deleteBoard);

// Board actions
router.patch('/:id/archive', validateRequest(boardIdSchema), boardController.archiveBoard);
router.patch('/:id/favourite', validateRequest(boardIdSchema), boardController.favouriteBoard);

// Board members
router.get('/:id/members', validateRequest(boardIdSchema), boardController.getBoardMembers);
router.post('/:id/members', validateRequest(inviteMemberSchema), boardController.inviteMember);
router.delete('/:id/members/:memberId', validateRequest(removeMemberSchema), boardController.removeMember);

export default router;