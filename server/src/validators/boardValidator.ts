import { z } from 'zod';
import { BoardMemberRole } from '@prisma/client';

export const createBoardSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Board title is required').max(100, 'Title is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
  }),
});

export const updateBoardSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid board ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).nullable().optional(),
    isArchived: z.boolean().optional(),
    isFavourite: z.boolean().optional(),
  }),
});

export const boardIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid board ID'),
  }),
});

export const inviteMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid board ID'),
  }),
  body: z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum([BoardMemberRole.ADMIN, BoardMemberRole.MEMBER], {
      errorMap: () => ({ message: 'Role must be ADMIN or MEMBER' }),
    }),
  }),
});

export const removeMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid board ID'),
    memberId: z.string().uuid('Invalid member ID'),
  }),
});