import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Board title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

export const createColumnSchema = z.object({
  title: z.string().min(1, 'Column title is required').max(50, 'Title is too long'),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  dueDate: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateBoardFormData = z.infer<typeof createBoardSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;