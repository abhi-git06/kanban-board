import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard analytics
router.get('/stats', dashboardController.getStats);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/productivity', dashboardController.getProductivityData);

export default router;