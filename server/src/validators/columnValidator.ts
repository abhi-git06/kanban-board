import { z } from 'zod';

export const createColumnSchema = z.object({
  body: z.object({
    boardId: z.string().uuid('Invalid board ID'),
    title: z.string().min(1, 'Column title is required').max(50, 'Title is too long'),
  }),
});

export const updateColumnSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Column ID is required'),
  }),
  body: z.object({
    title: z.string().min(1).max(50).optional(),
    order: z.number().int().min(0).optional(),
  }),
});

export const columnIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Column ID is required'),
  }),
});

export const getColumnsSchema = z.object({
  query: z.object({
    boardId: z.string().uuid('Invalid board ID'),
  }),
});

export const reorderColumnsSchema = z.object({
  body: z.object({
    boardId: z.string().uuid('Invalid board ID'),
    columns: z.array(
      z.object({
        columnId: z.number().int().min(0, 'Invalid column ID'),
        newOrder: z.number().int().min(0, 'Invalid order'),
      })
    ).min(1, 'At least one column is required'),
  }),
});