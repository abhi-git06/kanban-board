import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { CreateBoardInput, UpdateBoardInput, BoardWithRelations } from '../types/board';

const boardListSelect = {
  id: true,
  title: true,
  description: true,
  isArchived: true,
  isFavourite: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  members: {
    select: {
      id: true,
      userId: true,
      role: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  },
  columns: {
    select: {
      id: true,
      title: true,
      order: true,
      tasks: {
        select: {
          id: true,
          title: true,
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
      },
    },
  },
} satisfies Prisma.BoardSelect;

export const boardRepository = {
  async findById(id: string): Promise<BoardWithRelations | null> {
    const board = await prisma.board.findUnique({
      where: { id },
      select: boardListSelect,
    });
    return board as BoardWithRelations | null;
  },

  async findByIdWithMembers(id: string) {
    return prisma.board.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  },

  async findByUserId(userId: string): Promise<BoardWithRelations[]> {
    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId },
            },
          },
        ],
        isArchived: false,
      },
      select: boardListSelect,
      orderBy: { updatedAt: 'desc' },
    });
    return boards as BoardWithRelations[];
  },

  async findAllByUserId(userId: string): Promise<BoardWithRelations[]> {
    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId },
            },
          },
        ],
      },
      select: boardListSelect,
      orderBy: { updatedAt: 'desc' },
    });
    return boards as BoardWithRelations[];
  },

  async create(data: CreateBoardInput & { ownerId: string }): Promise<BoardWithRelations> {
    const board = await prisma.board.create({
      data: {
        ...data,
        members: {
          create: {
            userId: data.ownerId,
            role: 'OWNER',
          },
        },
      },
      select: boardListSelect,
    });
    return board as BoardWithRelations;
  },

  async update(id: string, data: UpdateBoardInput): Promise<BoardWithRelations> {
    const board = await prisma.board.update({
      where: { id },
      data,
      select: boardListSelect,
    });
    return board as BoardWithRelations;
  },

  async delete(id: string): Promise<void> {
    await prisma.board.delete({
      where: { id },
    });
  },

  async addMember(boardId: string, userId: string, role: string) {
    return prisma.boardMember.create({
      data: {
        boardId,
        userId,
        role: role as any,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  },

  async removeMember(memberId: string): Promise<void> {
    await prisma.boardMember.delete({
      where: { id: memberId },
    });
  },

  async findMemberById(memberId: string) {
    return prisma.boardMember.findUnique({
      where: { id: memberId },
    });
  },

  async findMemberByBoardAndUser(boardId: string, userId: string) {
    return prisma.boardMember.findFirst({
      where: { boardId, userId },
    });
  },
};