import { columnRepository } from '../repositories/columnRepository';
import { boardRepository } from '../repositories/boardRepository';
import { activityRepository } from '../repositories/activityRepository';
import { ApiError } from '../utils/response';
import { CreateColumnInput, UpdateColumnInput, ReorderColumnInput } from '../types/column';

async function checkBoardAccess(boardId: string, userId: string): Promise<void> {
  const board = await boardRepository.findById(boardId);
  if (!board) {
    throw new ApiError('Board not found', 404, 'NOT_FOUND');
  }

  const hasAccess =
    board.ownerId === userId ||
    board.members?.some((m) => m.userId === userId);

  if (!hasAccess) {
    throw new ApiError('Access denied', 403, 'FORBIDDEN');
  }
}

export const columnService = {
  async getColumns(boardId: string, userId: string) {
    await checkBoardAccess(boardId, userId);
    return columnRepository.findByBoardId(boardId);
  },

  async getColumn(columnId: number, userId: string) {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new ApiError('Column not found', 404, 'NOT_FOUND');
    }

    await checkBoardAccess(column.boardId, userId);
    return column;
  },

  async createColumn(data: CreateColumnInput, userId: string) {
    await checkBoardAccess(data.boardId, userId);

    // Check if user has write access (not just view)
    const board = await boardRepository.findById(data.boardId);
    const memberRole = board?.members?.find((m) => m.userId === userId)?.role;
    if (board?.ownerId !== userId && memberRole === 'MEMBER') {
      throw new ApiError('Only owners and admins can create columns', 403, 'FORBIDDEN');
    }

    return columnRepository.create(data);
  },

  async updateColumn(
    columnId: number,
    data: UpdateColumnInput,
    userId: string
  ) {
    const column = await this.getColumn(columnId, userId);

    // Check write permissions
    const board = await boardRepository.findById(column.boardId);
    const memberRole = board?.members?.find((m) => m.userId === userId)?.role;
    if (board?.ownerId !== userId && memberRole === 'MEMBER') {
      throw new ApiError('Only owners and admins can update columns', 403, 'FORBIDDEN');
    }

    return columnRepository.update(columnId, data);
  },

  async deleteColumn(columnId: number, userId: string): Promise<void> {
    const column = await this.getColumn(columnId, userId);

    // Check write permissions
    const board = await boardRepository.findById(column.boardId);
    const memberRole = board?.members?.find((m) => m.userId === userId)?.role;
    if (board?.ownerId !== userId && memberRole === 'MEMBER') {
      throw new ApiError('Only owners and admins can delete columns', 403, 'FORBIDDEN');
    }

    await columnRepository.delete(columnId);
  },

  async reorderColumns(
    boardId: string,
    reorderData: ReorderColumnInput[],
    userId: string
  ) {
    await checkBoardAccess(boardId, userId);

    // Verify all columns belong to this board
    const existingColumns = await columnRepository.findByBoardId(boardId);
    const existingIds = new Set(existingColumns.map((c) => c.id));

    for (const item of reorderData) {
      if (!existingIds.has(item.columnId)) {
        throw new ApiError(`Column ${item.columnId} does not belong to this board`, 400, 'BAD_REQUEST');
      }
    }

    // Check for duplicate orders
    const orders = reorderData.map((d) => d.newOrder);
    if (new Set(orders).size !== orders.length) {
      throw new ApiError('Duplicate order values detected', 400, 'BAD_REQUEST');
    }

    return columnRepository.reorder(boardId, reorderData);
  },
};