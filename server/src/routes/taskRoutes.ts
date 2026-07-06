import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authMiddleware';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  getTasksSchema,
  reorderTaskSchema,
  addLabelSchema,
  removeLabelSchema,
  addChecklistItemSchema,
  toggleChecklistItemSchema,
  deleteChecklistItemSchema,
  createCommentSchema,
  deleteCommentSchema,
  uploadAttachmentSchema,
} from '../validators/taskValidator';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// Task CRUD
router.get('/', validateRequest(getTasksSchema), taskController.getTasks);
router.get('/:id', validateRequest(taskIdSchema), taskController.getTask);
router.post('/', validateRequest(createTaskSchema), taskController.createTask);
router.patch('/:id', validateRequest(updateTaskSchema), taskController.updateTask);
router.delete('/:id', validateRequest(taskIdSchema), taskController.deleteTask);

// Task reordering (drag & drop)
router.patch('/reorder', validateRequest(reorderTaskSchema), taskController.reorderTask);

// Labels
router.post('/:id/labels', validateRequest(addLabelSchema), taskController.addLabel);
router.delete('/:id/labels/:labelId', validateRequest(removeLabelSchema), taskController.removeLabel);

// Checklist
router.post('/:id/checklist', validateRequest(addChecklistItemSchema), taskController.addChecklistItem);
router.patch('/:id/checklist/:itemId/toggle', validateRequest(toggleChecklistItemSchema), taskController.toggleChecklistItem);
router.delete('/:id/checklist/:itemId', validateRequest(deleteChecklistItemSchema), taskController.deleteChecklistItem);

// Comments
router.get('/:id/comments', validateRequest(taskIdSchema), taskController.getComments);
router.post('/:id/comments', validateRequest(createCommentSchema), taskController.addComment);
router.delete('/:id/comments/:commentId', validateRequest(deleteCommentSchema), taskController.deleteComment);

// Attachments
router.get('/:id/attachments', validateRequest(taskIdSchema), taskController.getAttachments);
router.post('/:id/attachments', validateRequest(uploadAttachmentSchema), taskController.addAttachment);
router.delete('/:id/attachments/:attachmentId', validateRequest(taskIdSchema), taskController.deleteAttachment);

// Activity logs
router.get('/:id/activity', validateRequest(taskIdSchema), taskController.getActivityLogs);

export default router;