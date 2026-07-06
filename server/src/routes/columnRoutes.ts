import { Router } from 'express';
import { columnController } from '../controllers/columnController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authMiddleware';
import {
  createColumnSchema,
  updateColumnSchema,
  columnIdSchema,
  getColumnsSchema,
  reorderColumnsSchema,
} from '../validators/columnValidator';

const router = Router();

// All column routes require authentication
router.use(authenticate);

// Column CRUD
router.get('/', validateRequest(getColumnsSchema), columnController.getColumns);
router.get('/:id', validateRequest(columnIdSchema), columnController.getColumn);
router.post('/', validateRequest(createColumnSchema), columnController.createColumn);
router.patch('/:id', validateRequest(updateColumnSchema), columnController.updateColumn);
router.delete('/:id', validateRequest(columnIdSchema), columnController.deleteColumn);

// Column actions
router.patch('/reorder', validateRequest(reorderColumnsSchema), columnController.reorderColumns);

export default router;