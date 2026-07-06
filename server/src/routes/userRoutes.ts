import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// User profile
router.get('/:id', userController.getUserById);
router.patch('/profile', userController.updateProfile);

// User search (for task assignment & invitations)
router.get('/search', userController.searchUsers);

// User's boards
router.get('/boards', userController.getUserBoards);

export default router;