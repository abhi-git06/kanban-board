import { z } from 'zod';
import { Priority, Status } from '@prisma/client';

export const createTaskSchema = z.object({
  body: z.object({
    boardId: z.string().uuid('Invalid board ID'),
    columnId: z.string().min(1, 'Column ID is required'),
    title: z.string().min(1, 'Task title is required').max(200, 'Title is too long'),
    description: z.string().max(2000, 'Description is too long').optional().nullable(),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT]).optional(),
    status: z.enum([Status.BACKLOG, Status.TODO, Status.IN_PROGRESS, Status.REVIEW, Status.DONE]).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    assignedToId: z.string().uuid('Invalid user ID').optional().nullable(),
    labelIds: z.array(z.string().uuid()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).nullable().optional(),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT]).optional(),
    status: z.enum([Status.BACKLOG, Status.TODO, Status.IN_PROGRESS, Status.REVIEW, Status.DONE]).optional(),
    dueDate: z.string().datetime().nullable().optional(),
    columnId: z.string().min(1).optional(),
    assignedToId: z.string().uuid().nullable().optional(),
    labelIds: z.array(z.string().uuid()).optional(),
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
});

export const getTasksSchema = z.object({
  query: z.object({
    boardId: z.string().uuid('Invalid board ID'),
  }),
});

export const reorderTaskSchema = z.object({
  body: z.object({
    taskId: z.string().uuid('Invalid task ID'),
    sourceColumnId: z.string().min(1, 'Source column ID is required'),
    targetColumnId: z.string().min(1, 'Target column ID is required'),
    newOrder: z.number().int().min(0, 'Invalid order'),
  }),
});

export const addLabelSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    labelId: z.string().uuid('Invalid label ID'),
  }),
});

export const removeLabelSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
    labelId: z.string().uuid('Invalid label ID'),
  }),
});

export const addChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    text: z.string().min(1, 'Checklist item text is required').max(200, 'Text is too long'),
    order: z.number().int().min(0).optional(),
  }),
});

export const toggleChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
    itemId: z.string().uuid('Invalid item ID'),
  }),
});

export const deleteChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
    itemId: z.string().uuid('Invalid item ID'),
  }),
});

export const createCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
    commentId: z.string().uuid('Invalid comment ID'),
  }),
});

export const uploadAttachmentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
});