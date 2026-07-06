import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authRateLimiter } from '../middleware/authMiddleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/authValidator';

const router = Router();

// Public routes with rate limiting
router.post('/register', authRateLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refresh);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;