import { prisma } from '../config/database';
import { CreateColumnInput, UpdateColumnInput, ReorderColumnInput } from '../types/column';

export const columnRepository = {
  async findById(id: number) {
    return prisma.column.findUnique({
      where: { id },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true,
            dueDate: true,
            order: true,
            assignedToId: true,
            assignedTo: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  },

  async findByBoardId(boardId: string) {
    return prisma.column.findMany({
      where: { boardId },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true,
            dueDate: true,
            order: true,
            assignedToId: true,
            assignedTo: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  },

  async create(data: CreateColumnInput) {
    // Get the highest order for this board to append at the end
    const lastColumn = await prisma.column.findFirst({
      where: { boardId: data.boardId },
      orderBy: { order: 'desc' },
    });

    return prisma.column.create({
      data: {
        ...data,
        order: lastColumn ? lastColumn.order + 1 : 0,
      },
      include: {
        tasks: true,
      },
    });
  },

  async update(id: number, data: UpdateColumnInput) {
    return prisma.column.update({
      where: { id },
      data,
      include: {
        tasks: true,
      },
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.column.delete({
      where: { id },
    });
  },

  async reorder(boardId: string, reorderData: ReorderColumnInput[]) {
    return prisma.$transaction(
      reorderData.map((item) =>
        prisma.column.update({
          where: { id: item.columnId },
          data: { order: item.newOrder },
        })
      )
    );
  },
};